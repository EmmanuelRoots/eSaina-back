import {
  CreateIssueCommentRequestDTO,
  CreateIssueRequestDTO,
  IssuePriority,
  IssueStatus,
  IssueType,
  UpdateIssueRequestDTO,
} from "../../data/dto/issue.dto";
import { NotificationType } from "../../data/dto/notification.dto";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";
import sseSa from "./sse.sa";
import { toIssueCommentDTO, toIssueDTO } from "../../data/dto/mappers/issue.mappers";
import { StatusCategory } from "@prisma/client";
import {
  sendIssueAssigned,
  sendIssueStatusChanged,
  sendIssueCommented,
} from "../technical/mail";

/**
 * Vérifie que l'assignee est bien membre d'une équipe rattachée au projet.
 * Si le projet n'a aucune équipe, la contrainte ne s'applique pas.
 *
 * @throws ApiError(400) si l'assignee n'est pas membre de l'équipe du projet.
 */
const assertAssigneeIsTeamMember = async (
  projectId: string,
  assigneeId: string,
) => {
  const teamLinks = await prisma.teamProject.findMany({ where: { projectId } });
  if (teamLinks.length === 0) return; // Pas d'équipe → pas de restriction

  const membership = await prisma.teamMember.findFirst({
    where: {
      userId: assigneeId,
      teamId: { in: teamLinks.map((t) => t.teamId) },
    },
  });

  if (!membership) {
    throw new ApiError(
      400,
      "L'assignee doit être membre d'une équipe rattachée au projet",
      "assignee_not_team_member",
    );
  }
};

const createIssue = async (
  payload: CreateIssueRequestDTO,
  reporterId: string,
) => {
  try {
    if (payload.assigneeId) {
      await assertAssigneeIsTeamMember(payload.projectId, payload.assigneeId);
    }

    const res = await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { id: payload.projectId },
        data: { issueCounter: { increment: 1 } },
        select: { issueCounter: true, key: true },
      });

      let statusId = payload.statusId;
      if (!statusId) {
        const defaultStatus = await tx.projectStatus.findFirst({
          where: { projectId: payload.projectId, category: StatusCategory.TODO },
          orderBy: { position: "asc" },
        });
        statusId = defaultStatus?.id;
      }

      const issue = await tx.issue.create({
        data: {
          projectId: payload.projectId,
          number: project.issueCounter,
          title: payload.title,
          description: payload.description,
          type: payload.type ?? IssueType.TASK,
          status: payload.status ?? IssueStatus.TODO,
          statusId: statusId,
          priority: payload.priority ?? IssuePriority.MEDIUM,
          storyPoints: payload.storyPoints,
          estimatedMinutes: payload.estimatedMinutes,
          startDate: payload.startDate ? new Date(payload.startDate) : undefined,
          dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
          sprintId: payload.sprintId,
          assigneeId: payload.assigneeId,
          reporterId,
          parentIssueId: payload.parentIssueId,
          labels: payload.labelIds?.length
            ? { create: payload.labelIds.map((labelId) => ({ labelId })) }
            : undefined,
        },
        include: {
          assignee: true,
          reporter: true,
          projectStatus: true,
          labels: { include: { label: true } },
        },
      });

      return { issue, projectKey: project.key };
    });

    if (res.issue.assigneeId && res.issue.assigneeId !== reporterId && res.issue.assignee) {
      const ref = `${res.projectKey}-${res.issue.number}`
      const reporterName = `${res.issue.reporter.firstName} ${res.issue.reporter.lastName}`

      // Notification SSE en temps réel
      await sseSa.sendEventToUser({
        userId: res.issue.assigneeId,
        type: NotificationType.ISSUE_ASSIGNED,
        title: `Ticket assigné : ${ref}`,
        message: res.issue.title,
        data: { issueId: res.issue.id, projectId: res.issue.projectId, event: "ISSUE_ASSIGNED" },
        read: false,
      });

      // Mail transactionnel vers l'assignee
      await sendIssueAssigned(
        res.issue.assignee.email,
        res.projectKey,
        res.issue.number,
        res.issue.title,
        reporterName,
      );
    }

    return { success: true, data: toIssueDTO(res.issue, res.projectKey) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on create issue");
  }
};

const listIssues = async (
  projectId: string,
  filters: {
    sprintId?: string;
    assigneeId?: string;
    status?: IssueStatus;
    statusId?: string;
    type?: IssueType;
  } = {},
) => {
  try {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
      select: { key: true },
    });
    if (!project) throw new ApiError(404, "Project not found");

    const res = await prisma.issue.findMany({
      where: {
        projectId,
        sprintId: filters.sprintId,
        assigneeId: filters.assigneeId,
        status: filters.status,
        statusId: filters.statusId,
        type: filters.type,
      },
      include: {
        assignee: true,
        reporter: true,
        projectStatus: true,
        labels: { include: { label: true } },
      },
      orderBy: [{ position: "asc" }, { createdAt: "desc" }],
    });
    return { success: true, data: res.map((i) => toIssueDTO(i, project.key)) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list issues");
  }
};

const getIssueById = async (issueId: string) => {
  try {
    const res = await prisma.issue.findUnique({
      where: { id: issueId },
      include: {
        project: { select: { key: true } },
        assignee: true,
        reporter: true,
        sprint: true,
        projectStatus: true,
        labels: { include: { label: true } },
        comments: { include: { author: true }, orderBy: { createdAt: "asc" } },
        childIssues: true,
        attachments: true,
      },
    });
    if (!res) throw new ApiError(404, "Issue not found");
    return { success: true, data: toIssueDTO(res) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on get issue");
  }
};

const updateIssue = async (
  issueId: string,
  payload: UpdateIssueRequestDTO,
  actorId: string,
) => {
  try {
    const before = await prisma.issue.findUnique({
      where: { id: issueId },
      select: {
        assigneeId: true,
        status: true,
        statusId: true,
        projectId: true,
        // Nécessaire pour les mails de changement de statut
        assignee: { select: { id: true, email: true, firstName: true, lastName: true } },
        reporter: { select: { id: true, email: true, firstName: true, lastName: true } },
        projectStatus: { select: { name: true } },
      },
    });
    if (!before) throw new ApiError(404, "Issue not found");

    if (payload.assigneeId && payload.assigneeId !== before.assigneeId) {
      await assertAssigneeIsTeamMember(before.projectId, payload.assigneeId);
    }

    // Si statusId change, synchroniser le champ legacy 'status' avec la catégorie du nouveau statut
    let status = payload.status;
    let newStatusName: string | undefined;
    if (payload.statusId && payload.statusId !== before.statusId) {
      const newProjectStatus = await prisma.projectStatus.findUnique({ where: { id: payload.statusId } });
      if (newProjectStatus) {
        newStatusName = newProjectStatus.name;
        if (newProjectStatus.category === StatusCategory.TODO) status = IssueStatus.TODO;
        else if (newProjectStatus.category === StatusCategory.IN_PROGRESS) status = IssueStatus.IN_PROGRESS;
        else if (newProjectStatus.category === StatusCategory.DONE) status = IssueStatus.DONE;
      }
    }

    const res = await prisma.issue.update({
      where: { id: issueId },
      data: {
        title: payload.title,
        description: payload.description,
        type: payload.type,
        status: status,
        statusId: payload.statusId,
        priority: payload.priority,
        storyPoints: payload.storyPoints,
        estimatedMinutes: payload.estimatedMinutes,
        startDate: payload.startDate ? new Date(payload.startDate) : undefined,
        dueDate: payload.dueDate ? new Date(payload.dueDate) : undefined,
        position: payload.position,
        sprintId: payload.sprintId,
        assigneeId: payload.assigneeId,
        parentIssueId: payload.parentIssueId,
      },
      include: {
        project: { select: { key: true } },
        assignee: true,
        reporter: true,
        projectStatus: true,
        labels: { include: { label: true } },
      },
    });

    const projectKey = res.project.key;
    const ref = `${projectKey}-${res.number}`;
    const actorName = res.reporter
      ? `${res.reporter.firstName} ${res.reporter.lastName}`
      : 'Quelqu\'un';

    // ── Notification : changement d'assignee ──────────────────────────────────
    if (
      payload.assigneeId &&
      payload.assigneeId !== before.assigneeId &&
      payload.assigneeId !== actorId &&
      res.assignee
    ) {
      await sseSa.sendEventToUser({
        userId: payload.assigneeId,
        type: NotificationType.ISSUE_ASSIGNED,
        title: `Ticket assigné : ${ref}`,
        message: res.title,
        data: { issueId: res.id, projectId: res.projectId, event: "ISSUE_ASSIGNED" },
        read: false,
      });
      await sendIssueAssigned(
        res.assignee.email,
        projectKey,
        res.number,
        res.title,
        actorName,
      );
    }

    // ── Notification : changement de statut ───────────────────────────────────
    if (payload.statusId && payload.statusId !== before.statusId && newStatusName) {
      const oldStatusName = before.projectStatus?.name ?? before.status;
      const recipients = new Set<{ id: string; email: string }>()
      if (res.assignee && res.assignee.id !== actorId) recipients.add({ id: res.assignee.id, email: res.assignee.email });
      if (res.reporter && res.reporter.id !== actorId) recipients.add({ id: res.reporter.id, email: res.reporter.email });

      for (const recipient of recipients) {
        await sseSa.sendEventToUser({
          userId: recipient.id,
          type: NotificationType.ISSUE_STATUS_CHANGED,
          title: `Statut mis à jour : ${ref}`,
          message: `${oldStatusName} → ${newStatusName}`,
          data: { issueId: res.id, projectId: res.projectId, event: "ISSUE_STATUS_CHANGED", oldStatus: oldStatusName, newStatus: newStatusName },
          read: false,
        });
        await sendIssueStatusChanged(
          recipient.email,
          projectKey,
          res.number,
          res.title,
          String(oldStatusName),
          newStatusName,
          actorName,
        );
      }
    }

    return { success: true, data: toIssueDTO(res) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on update issue");
  }
};

const deleteIssue = async (issueId: string) => {
  try {
    await prisma.issue.delete({ where: { id: issueId } });
    return { success: true, message: "issue deleted" };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on delete issue");
  }
};

const addComment = async (
  payload: CreateIssueCommentRequestDTO,
  authorId: string,
) => {
  try {
    const res = await prisma.issueComment.create({
      data: {
        issueId: payload.issueId,
        authorId,
        content: payload.content,
        parentId: payload.parentId,
      },
      include: {
        author: true,
        // Récupère l'issue avec les destinataires pour les notifications
        issue: {
          include: {
            project: { select: { key: true } },
            assignee: { select: { id: true, email: true } },
            reporter: { select: { id: true, email: true } },
          },
        },
      },
    });

    const issue = res.issue;
    const projectKey = issue.project.key;
    const commenterName = `${res.author.firstName} ${res.author.lastName}`;

    // Notifie assignee et reporter, sauf l'auteur du commentaire lui-même
    const recipients = new Set<{ id: string; email: string }>();
    if (issue.assignee && issue.assignee.id !== authorId) recipients.add(issue.assignee);
    if (issue.reporter && issue.reporter.id !== authorId) recipients.add(issue.reporter);

    for (const recipient of recipients) {
      await sseSa.sendEventToUser({
        userId: recipient.id,
        type: NotificationType.ISSUE_COMMENTED,
        title: `Nouveau commentaire : ${projectKey}-${issue.number}`,
        message: payload.content.slice(0, 100),
        data: { issueId: issue.id, projectId: issue.projectId, event: "ISSUE_COMMENTED", commentId: res.id },
        read: false,
      });
      await sendIssueCommented(
        recipient.email,
        projectKey,
        issue.number,
        issue.title,
        commenterName,
        payload.content,
      );
    }

    return { success: true, data: toIssueCommentDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on add issue comment");
  }
};

const listComments = async (issueId: string) => {
  try {
    const res = await prisma.issueComment.findMany({
      where: { issueId },
      include: { author: true },
      orderBy: { createdAt: "asc" },
    });
    return { success: true, data: res.map(toIssueCommentDTO) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list issue comments");
  }
};

export default {
  createIssue,
  listIssues,
  getIssueById,
  updateIssue,
  deleteIssue,
  addComment,
  listComments,
};
