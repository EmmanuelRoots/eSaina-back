/**
 * Service applicatif — Analytics / Tempo.
 *
 * Agrège les données de suivi temporel d'un projet à partir de ses
 * sprints et issues. Utilisé par le tableau de bord Tempo du frontend.
 *
 * Dépendances : PrismaClient (singleton), StatusCategory Prisma enum.
 */

import { StatusCategory } from "@prisma/client";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";

/** Vélocité d'un sprint : points planifiés vs réalisés. */
export interface SprintVelocity {
  sprintId: string;
  sprintName: string;
  status: string;
  startDate: string | null;
  endDate: string | null;
  /** Somme des storyPoints de toutes les issues du sprint. */
  planned: number;
  /** Somme des storyPoints des issues dont le statut est DONE. */
  completed: number;
}

/** Répartition d'issues par une dimension (type, priorité…). */
export interface IssueRepartition {
  label: string;
  count: number;
}

/** Charge d'un membre (issues assignées dans le projet). */
export interface MemberWorkload {
  userId: string;
  firstName: string;
  lastName: string;
  pdpUrl: string | null;
  /** Issues assignées toutes catégories confondues. */
  assigned: number;
  /** Issues assignées dont le statut est DONE. */
  done: number;
}

/** Sprint actif : avancement TODO / IN_PROGRESS / DONE. */
export interface ActiveSprintProgress {
  id: string;
  name: string;
  goal: string | null;
  startDate: string | null;
  endDate: string | null;
  todo: number;
  inProgress: number;
  done: number;
  total: number;
}

/** Charge hebdomadaire — issues closes et créées par semaine sur les N dernières semaines. */
export interface WeeklyActivity {
  /** Label de la semaine (ex. "S01", "S12"). */
  week: string;
  created: number;
  closed: number;
}

/** Payload complet retourné par getProjectAnalytics. */
export interface ProjectAnalyticsDTO {
  velocity: SprintVelocity[];
  issuesByType: IssueRepartition[];
  issuesByPriority: IssueRepartition[];
  activeSprint: ActiveSprintProgress | null;
  memberWorkload: MemberWorkload[];
  weeklyActivity: WeeklyActivity[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Retourne le label "SISO" (semaine ISO) d'une date.
 * Ex. : 2024-03-10 → "S10"
 */
const isoWeekLabel = (date: Date): string => {
  const jan1 = new Date(date.getFullYear(), 0, 1);
  const week = Math.ceil(
    ((date.getTime() - jan1.getTime()) / 86_400_000 + jan1.getDay() + 1) / 7,
  );
  return `S${String(week).padStart(2, "0")}`;
};

// ---------------------------------------------------------------------------
// Service
// ---------------------------------------------------------------------------

/**
 * Calcule les métriques Tempo d'un projet pour le tableau de bord :
 * - vélocité par sprint
 * - répartitions (type, priorité)
 * - progression du sprint actif
 * - charge par membre
 * - activité hebdomadaire sur 8 semaines
 *
 * @param projectId - Identifiant du projet.
 * @returns Objet ProjectAnalyticsDTO.
 * @throws ApiError(404) si le projet est introuvable.
 */
const getProjectAnalytics = async (
  projectId: string,
): Promise<{ success: boolean; data: ProjectAnalyticsDTO }> => {
  try {
    // Vérification existence du projet
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { id: true },
    });
    if (!project) throw new ApiError(404, "Projet introuvable");

    // Chargement des sprints + issues associées
    const sprints = await prisma.sprint.findMany({
      where: { projectId },
      include: {
        issues: {
          include: {
            projectStatus: { select: { category: true } },
          },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    // Toutes les issues du projet (pour répartitions et charge)
    const allIssues = await prisma.issue.findMany({
      where: { projectId },
      include: {
        assignee: {
          select: { id: true, firstName: true, lastName: true, pdpUrl: true },
        },
        projectStatus: { select: { category: true } },
      },
    });

    // --- Vélocité par sprint -----------------------------------------------
    const velocity: SprintVelocity[] = sprints.map((sprint) => {
      const planned = sprint.issues.reduce(
        (sum, i) => sum + (i.storyPoints ?? 0),
        0,
      );
      const completed = sprint.issues
        .filter((i) => i.projectStatus?.category === StatusCategory.DONE)
        .reduce((sum, i) => sum + (i.storyPoints ?? 0), 0);

      return {
        sprintId: sprint.id,
        sprintName: sprint.name,
        status: sprint.status,
        startDate: sprint.startDate?.toISOString() ?? null,
        endDate: sprint.endDate?.toISOString() ?? null,
        planned,
        completed,
      };
    });

    // --- Répartitions -------------------------------------------------------
    const typeCount: Record<string, number> = {};
    const priorityCount: Record<string, number> = {};
    allIssues.forEach((issue) => {
      typeCount[issue.type] = (typeCount[issue.type] ?? 0) + 1;
      priorityCount[issue.priority] = (priorityCount[issue.priority] ?? 0) + 1;
    });
    const issuesByType: IssueRepartition[] = Object.entries(typeCount).map(
      ([label, count]) => ({ label, count }),
    );
    const issuesByPriority: IssueRepartition[] = Object.entries(
      priorityCount,
    ).map(([label, count]) => ({ label, count }));

    // --- Sprint actif -------------------------------------------------------
    const activeSprint = sprints.find((s) => s.status === "ACTIVE") ?? null;
    let activeSprintProgress: ActiveSprintProgress | null = null;
    if (activeSprint) {
      const todo = activeSprint.issues.filter(
        (i) => i.projectStatus?.category === StatusCategory.TODO,
      ).length;
      const inProgress = activeSprint.issues.filter(
        (i) => i.projectStatus?.category === StatusCategory.IN_PROGRESS,
      ).length;
      const done = activeSprint.issues.filter(
        (i) => i.projectStatus?.category === StatusCategory.DONE,
      ).length;
      activeSprintProgress = {
        id: activeSprint.id,
        name: activeSprint.name,
        goal: activeSprint.goal ?? null,
        startDate: activeSprint.startDate?.toISOString() ?? null,
        endDate: activeSprint.endDate?.toISOString() ?? null,
        todo,
        inProgress,
        done,
        total: activeSprint.issues.length,
      };
    }

    // --- Charge par membre --------------------------------------------------
    const workloadMap: Record<string, MemberWorkload> = {};
    allIssues.forEach((issue) => {
      if (!issue.assignee) return;
      const u = issue.assignee;
      if (!workloadMap[u.id]) {
        workloadMap[u.id] = {
          userId: u.id,
          firstName: u.firstName,
          lastName: u.lastName,
          pdpUrl: u.pdpUrl,
          assigned: 0,
          done: 0,
        };
      }
      workloadMap[u.id].assigned += 1;
      if (issue.projectStatus?.category === StatusCategory.DONE) {
        workloadMap[u.id].done += 1;
      }
    });
    const memberWorkload = Object.values(workloadMap);

    // --- Activité hebdomadaire (8 semaines glissantes) ----------------------
    const now = new Date();
    const eightWeeksAgo = new Date(now.getTime() - 8 * 7 * 24 * 3_600_000);

    // Issues créées dans les 8 dernières semaines
    const recentIssues = await prisma.issue.findMany({
      where: { projectId, createdAt: { gte: eightWeeksAgo } },
      select: { createdAt: true, projectStatus: { select: { category: true } } },
    });

    // Initialisation des 8 semaines
    const weekMap: Record<string, WeeklyActivity> = {};
    for (let w = 7; w >= 0; w--) {
      const d = new Date(now.getTime() - w * 7 * 24 * 3_600_000);
      const label = isoWeekLabel(d);
      weekMap[label] = { week: label, created: 0, closed: 0 };
    }

    recentIssues.forEach((issue) => {
      const label = isoWeekLabel(issue.createdAt);
      if (weekMap[label]) {
        weekMap[label].created += 1;
        if (issue.projectStatus?.category === StatusCategory.DONE) {
          weekMap[label].closed += 1;
        }
      }
    });

    const weeklyActivity = Object.values(weekMap);

    return {
      success: true,
      data: {
        velocity,
        issuesByType,
        issuesByPriority,
        activeSprint: activeSprintProgress,
        memberWorkload,
        weeklyActivity,
      },
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "erreur analytics projet");
  }
};

export default { getProjectAnalytics };
