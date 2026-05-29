/**
 * Service applicatif — gestion des WorkLogs (saisie des tempos).
 *
 * Place dans le flux : IssueController/WorkLogController → worklog.sa → Prisma.
 *
 * Règles métier :
 *  - Seul l'auteur d'un WorkLog peut le modifier ou le supprimer (403 sinon).
 *  - La durée doit être strictement positive.
 *  - getWorkLogsByProject supporte des filtres userId / from / to pour la
 *    feuille de temps hebdomadaire du front.
 *
 * Dépendances : Prisma, ApiError, PrismaExceptionHandler, worklog.mappers.
 */

import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import {
  CreateWorkLogDTO,
  UpdateWorkLogDTO,
  WorkLogProjectFiltersDTO,
} from "../../data/dto/worklog.dto";
import { toWorkLogDTO } from "../../data/dto/mappers/worklog.mappers";
import { prisma } from "../../repository";

/** Include Prisma réutilisé sur toutes les requêtes WorkLog. */
const WORKLOG_INCLUDE = {
  user: true,
  issue: {
    include: { project: { select: { key: true } } },
  },
} as const;

/**
 * Crée un pointage de temps sur une issue.
 *
 * @param payload - Données de saisie (issueId, date, durée, description).
 * @param authorId - Id de l'utilisateur connecté (injecté depuis req.user).
 * @returns Le WorkLogDTO créé.
 * @throws ApiError(400) si timeSpentMinutes ≤ 0.
 * @throws ApiError(404) si l'issue n'existe pas.
 */
const createWorkLog = async (payload: CreateWorkLogDTO, authorId: string) => {
  if (payload.timeSpentMinutes <= 0) {
    throw new ApiError(400, "timeSpentMinutes must be greater than 0");
  }

  try {
    const issue = await prisma.issue.findUnique({ where: { id: payload.issueId } });
    if (!issue) throw new ApiError(404, "Issue not found");

    const worklog = await prisma.workLog.create({
      data: {
        issueId: payload.issueId,
        userId: authorId,
        date: new Date(payload.date),
        timeSpentMinutes: payload.timeSpentMinutes,
        description: payload.description,
      },
      include: WORKLOG_INCLUDE,
    });

    return { success: true, data: toWorkLogDTO(worklog) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on create worklog");
  }
};

/**
 * Retourne tous les pointages d'une issue, triés par date décroissante.
 *
 * @param issueId - Id de l'issue.
 * @returns Liste de WorkLogDTO.
 */
const getWorkLogsByIssue = async (issueId: string) => {
  try {
    const worklogs = await prisma.workLog.findMany({
      where: { issueId },
      include: WORKLOG_INCLUDE,
      orderBy: { date: "desc" },
    });
    return { success: true, data: worklogs.map(toWorkLogDTO) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list worklogs by issue");
  }
};

/**
 * Retourne les pointages d'un projet pour la feuille de temps.
 * Supporte le filtrage par utilisateur et par plage de dates.
 *
 * @param projectId - Id du projet.
 * @param filters   - Filtres optionnels : userId, from (ISO date), to (ISO date).
 * @returns Liste de WorkLogDTO.
 */
const getWorkLogsByProject = async (
  projectId: string,
  filters: WorkLogProjectFiltersDTO = {},
) => {
  try {
    const worklogs = await prisma.workLog.findMany({
      where: {
        issue: { projectId },
        userId: filters.userId,
        date: {
          gte: filters.from ? new Date(filters.from) : undefined,
          lte: filters.to ? new Date(filters.to) : undefined,
        },
      },
      include: WORKLOG_INCLUDE,
      orderBy: [{ date: "asc" }, { createdAt: "asc" }],
    });
    return { success: true, data: worklogs.map(toWorkLogDTO) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list worklogs by project");
  }
};

/**
 * Met à jour un pointage existant.
 * Seul l'auteur du pointage peut le modifier.
 *
 * @param worklogId   - Id du WorkLog à modifier.
 * @param payload     - Champs à mettre à jour (tous optionnels).
 * @param requesterId - Id de l'utilisateur connecté.
 * @throws ApiError(403) si le demandeur n'est pas l'auteur.
 * @throws ApiError(404) si le WorkLog n'existe pas.
 */
const updateWorkLog = async (
  worklogId: string,
  payload: UpdateWorkLogDTO,
  requesterId: string,
) => {
  try {
    const existing = await prisma.workLog.findUnique({ where: { id: worklogId } });
    if (!existing) throw new ApiError(404, "WorkLog not found");
    if (existing.userId !== requesterId) {
      throw new ApiError(403, "You can only edit your own work logs");
    }

    if (payload.timeSpentMinutes !== undefined && payload.timeSpentMinutes <= 0) {
      throw new ApiError(400, "timeSpentMinutes must be greater than 0");
    }

    const worklog = await prisma.workLog.update({
      where: { id: worklogId },
      data: {
        date: payload.date ? new Date(payload.date) : undefined,
        timeSpentMinutes: payload.timeSpentMinutes,
        description: payload.description,
      },
      include: WORKLOG_INCLUDE,
    });

    return { success: true, data: toWorkLogDTO(worklog) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on update worklog");
  }
};

/**
 * Supprime un pointage.
 * Seul l'auteur du pointage peut le supprimer.
 *
 * @param worklogId   - Id du WorkLog à supprimer.
 * @param requesterId - Id de l'utilisateur connecté.
 * @throws ApiError(403) si le demandeur n'est pas l'auteur.
 * @throws ApiError(404) si le WorkLog n'existe pas.
 */
const deleteWorkLog = async (worklogId: string, requesterId: string) => {
  try {
    const existing = await prisma.workLog.findUnique({ where: { id: worklogId } });
    if (!existing) throw new ApiError(404, "WorkLog not found");
    if (existing.userId !== requesterId) {
      throw new ApiError(403, "You can only delete your own work logs");
    }

    await prisma.workLog.delete({ where: { id: worklogId } });
    return { success: true, message: "worklog deleted" };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on delete worklog");
  }
};

export default {
  createWorkLog,
  getWorkLogsByIssue,
  getWorkLogsByProject,
  updateWorkLog,
  deleteWorkLog,
};
