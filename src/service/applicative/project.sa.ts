import {
  AddProjectMemberRequestDTO,
  CreateProjectRequestDTO,
  ProjectMemberRole,
  UpdateProjectRequestDTO,
} from "../../data/dto/project.dto";
import { toProjectDTO, toProjectMemberDTO } from "../../data/dto/mappers/project.mappers";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";
import { IssueStatus } from "../../data/dto/issue.dto";
import { toIssueDTO } from "../../data/dto/mappers/issue.mappers";
import { toSprintDTO } from "../../data/dto/mappers/sprint.mappers";
import { StatusCategory } from "@prisma/client";

const createProject = async (
  payload: CreateProjectRequestDTO,
  ownerId: string,
) => {
  try {
    const memberIds = payload.memberIds ?? [];
    const memberCreates = [
      { userId: ownerId, role: ProjectMemberRole.ADMIN },
      ...memberIds
        .filter((id) => id !== ownerId)
        .map((id) => ({ userId: id, role: ProjectMemberRole.MEMBER })),
    ];

    const res = await prisma.project.create({
      data: {
        key: payload.key.toUpperCase(),
        name: payload.name,
        description: payload.description,
        ownerId,
        salonId: payload.salonId,
        members: {
          create: memberCreates,
        },
        statuses: {
          create: [
            { name: "Todo", color: "#94a3b8", position: 0, category: StatusCategory.TODO },
            { name: "In Progress", color: "#3b82f6", position: 1, category: StatusCategory.IN_PROGRESS },
            { name: "Done", color: "#22c55e", position: 2, category: StatusCategory.DONE },
          ],
        },
      },
      include: {
        owner: true,
        salon: true,
        members: { include: { user: true } },
        statuses: true,
      },
    });

    return { success: true, data: toProjectDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on create project");
  }
};

const getProjectsForUser = async (userId: string) => {
  try {
    const res = await prisma.project.findMany({
      where: {
        OR: [
          { ownerId: userId },
          { members: { some: { userId } } },
          // Projets rattachés à une équipe dont l'utilisateur est membre
          { teams: { some: { team: { members: { some: { userId } } } } } },
        ],
      },
      include: {
        owner: true,
        salon: true,
        members: { include: { user: true } },
        statuses: true,
      },
      orderBy: { updatedAt: "desc" },
    });
    return { success: true, data: res.map(toProjectDTO) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list projects");
  }
};

/**
 * Retourne les utilisateurs pouvant être assignés à un ticket du projet.
 *
 * Règle : si le projet est rattaché à au moins une équipe, seuls les membres
 * de ces équipes sont éligibles. Sinon, ce sont les membres directs du projet.
 *
 * @param projectId - Identifiant du projet.
 * @returns Liste { id, firstName, lastName, email, pdpUrl }.
 */
const getAssignableMembers = async (projectId: string) => {
  try {
    const teamLinks = await prisma.teamProject.findMany({
      where: { projectId },
      include: {
        team: {
          include: { members: { include: { user: true } } },
        },
      },
    });

    if (teamLinks.length > 0) {
      // Déduplique par userId au cas où un user serait dans plusieurs équipes liées
      const seen = new Set<string>();
      const users = teamLinks
        .flatMap((tp) => tp.team.members.map((m) => m.user))
        .filter((u) => {
          if (seen.has(u.id)) return false;
          seen.add(u.id);
          return true;
        });

      return { success: true, data: users };
    }

    // Pas d'équipe : fallback sur les membres directs du projet
    const projectMembers = await prisma.projectMember.findMany({
      where: { projectId },
      include: { user: true },
    });

    return { success: true, data: projectMembers.map((m) => m.user) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on get assignable members");
  }
};

const getProjectById = async (projectId: string) => {
  try {
    const res = await prisma.project.findUnique({
      where: { id: projectId },
      include: {
        owner: true,
        salon: true,
        members: { include: { user: true } },
        sprints: true,
        labels: true,
        statuses: { orderBy: { position: "asc" } },
      },
    });
    if (!res) throw new ApiError(404, "Project not found");
    return { success: true, data: toProjectDTO(res) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on get project");
  }
};

const updateProject = async (
  projectId: string,
  payload: UpdateProjectRequestDTO,
) => {
  try {
    const res = await prisma.project.update({
      where: { id: projectId },
      data: {
        name: payload.name,
        description: payload.description,
        salonId: payload.salonId,
      },
      include: {
        owner: true,
        salon: true,
        members: { include: { user: true } },
      },
    });
    return { success: true, data: toProjectDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on update project");
  }
};

const deleteProject = async (projectId: string) => {
  try {
    await prisma.project.delete({ where: { id: projectId } });
    return { success: true, message: "project deleted" };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on delete project");
  }
};

const getBoard = async (projectId: string) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { key: true },
    });
    if (!project) throw new ApiError(404, "Project not found");

    const issues = await prisma.issue.findMany({
      where: { projectId },
      include: {
        assignee: true,
        reporter: true,
        labels: { include: { label: true } },
      },
      orderBy: [{ statusId: "asc" }, { position: "asc" }],
    });

    const grouped = issues.reduce<Record<string, any>>(
      (acc, issue) => {
        const dto = toIssueDTO(issue, project.key);
        const statusKey = issue.statusId || "backlog";
        (acc[statusKey] ??= []).push(dto);
        return acc;
      },
      {},
    );

    return { success: true, data: grouped };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on get board");
  }
};

const getBacklog = async (projectId: string) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { key: true },
    });
    if (!project) throw new ApiError(404, "Project not found");

    const issuesWithoutSprint = await prisma.issue.findMany({
      where: { projectId, sprintId: null },
      include: {
        assignee: true,
        reporter: true,
        labels: { include: { label: true } },
      },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });

    const sprintsWithIssues = await prisma.sprint.findMany({
      where: { projectId },
      include: {
        issues: {
          include: {
            assignee: true,
            reporter: true,
            labels: { include: { label: true } },
          },
          orderBy: [{ position: "asc" }, { createdAt: "desc" }],
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      success: true,
      data: {
        backlog: issuesWithoutSprint.map((i) => toIssueDTO(i, project.key)),
        sprints: sprintsWithIssues.map((s) => ({
          ...toSprintDTO(s),
          issues: s.issues.map((i) => toIssueDTO(i, project.key)),
        })),
      },
    };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on get backlog");
  }
};

const addMember = async (
  projectId: string,
  payload: AddProjectMemberRequestDTO,
) => {
  try {
    const res = await prisma.projectMember.create({
      data: {
        projectId,
        userId: payload.userId,
        role: payload.role ?? ProjectMemberRole.MEMBER,
      },
      include: { user: true },
    });
    return { success: true, data: toProjectMemberDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on add project member");
  }
};

const removeMember = async (projectId: string, userId: string) => {
  try {
    await prisma.projectMember.delete({
      where: { projectId_userId: { projectId, userId } },
    });
    return { success: true, message: "member removed" };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on remove project member");
  }
};

export default {
  createProject,
  getProjectsForUser,
  getProjectById,
  updateProject,
  deleteProject,
  getBoard,
  getBacklog,
  addMember,
  removeMember,
  getAssignableMembers,
};
