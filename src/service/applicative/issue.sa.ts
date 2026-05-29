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

const createIssue = async (
  payload: CreateIssueRequestDTO,
  reporterId: string,
) => {
  try {
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

    if (res.issue.assigneeId && res.issue.assigneeId !== reporterId) {
      await sseSa.sendEventToUser({
        userId: res.issue.assigneeId,
        type: NotificationType.NOTIFICATION,
        title: `Issue assigned: ${res.projectKey}-${res.issue.number}`,
        message: res.issue.title,
        data: { issueId: res.issue.id, event: "ISSUE_ASSIGNED" },
        read: false,
      });
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
      select: { assigneeId: true, status: true, statusId: true, projectId: true },
    });
    if (!before) throw new ApiError(404, "Issue not found");

    // If statusId is changed, we should probably update the legacy 'status' field too if it's one of the standard ones
    // Or at least ensure 'status' reflects the category of the new projectStatus
    let status = payload.status;
    if (payload.statusId && payload.statusId !== before.statusId) {
        const newStatus = await prisma.projectStatus.findUnique({ where: { id: payload.statusId } });
        if (newStatus) {
            // Map category to IssueStatus enum
            if (newStatus.category === StatusCategory.TODO) status = IssueStatus.TODO;
            else if (newStatus.category === StatusCategory.IN_PROGRESS) status = IssueStatus.IN_PROGRESS;
            else if (newStatus.category === StatusCategory.DONE) status = IssueStatus.DONE;
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

    if (
      payload.assigneeId &&
      payload.assigneeId !== before.assigneeId &&
      payload.assigneeId !== actorId
    ) {
      await sseSa.sendEventToUser({
        userId: payload.assigneeId,
        type: NotificationType.NOTIFICATION,
        title: `Issue assigned: ${res.project.key}-${res.number}`,
        message: res.title,
        data: { issueId: res.id, event: "ISSUE_ASSIGNED" },
        read: false,
      });
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
      include: { author: true },
    });
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
