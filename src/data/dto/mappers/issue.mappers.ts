import {
  Issue,
  IssueComment,
  User,
  Project,
  Sprint,
  Label,
  IssueLabel,
  ProjectStatus,
} from "@prisma/client";
import { toISO } from "../../../utils/date.utils";
import {
  IssueCommentDTO,
  IssueDTO,
  IssuePriority,
  IssueStatus,
  IssueType,
} from "../issue.dto";
import { toUserDTO } from "./user.mappers";
import { toSprintDTO } from "./sprint.mappers";
import { toProjectStatusDTO } from "./project-status.mappers";

export const buildIssueKey = (projectKey: string, number: number): string =>
  `${projectKey}-${number}`;

export const toIssueDTO = (
  issue: Issue & {
    assignee?: User | null;
    reporter?: User;
    project?: { key: string };
    sprint?: Sprint | null;
    labels?: (IssueLabel & { label: Label })[];
    comments?: (IssueComment & { author?: User })[];
    projectStatus?: ProjectStatus | null;
  },
  projectKey?: string,
): IssueDTO => {
  const effectiveProjectKey = projectKey || issue.project?.key;

  return {
    id: issue.id,
    projectId: issue.projectId,
    number: issue.number,
    key: effectiveProjectKey
      ? buildIssueKey(effectiveProjectKey, issue.number)
      : undefined,
    title: issue.title,
    description: issue.description,
    type: issue.type as IssueType,
    status: issue.status as IssueStatus,
    statusId: issue.statusId,
    projectStatus: issue.projectStatus
      ? toProjectStatusDTO(issue.projectStatus)
      : undefined,
    priority: issue.priority as IssuePriority,
    storyPoints: issue.storyPoints,
    estimatedMinutes: issue.estimatedMinutes ?? undefined,
    startDate: issue.startDate ? toISO(issue.startDate) : undefined,
    dueDate: issue.dueDate ? toISO(issue.dueDate) : undefined,
    position: issue.position,
    sprintId: issue.sprintId,
    assigneeId: issue.assigneeId,
    assignee: issue.assignee ? toUserDTO(issue.assignee) : undefined,
    reporterId: issue.reporterId,
    reporter: issue.reporter ? toUserDTO(issue.reporter) : undefined,
    parentIssueId: issue.parentIssueId,
    labels: issue.labels?.map((il) => ({
      id: il.label.id,
      name: il.label.name,
      color: il.label.color,
    })),
    createdAt: toISO(issue.createdAt)!,
    updatedAt: toISO(issue.updatedAt)!,
  };
};

export const toIssueCommentDTO = (
  comment: IssueComment & { author?: User },
): IssueCommentDTO => ({
  id: comment.id,
  content: comment.content,
  issueId: comment.issueId,
  authorId: comment.authorId,
  author: comment.author ? toUserDTO(comment.author) : undefined,
  parentId: comment.parentId,
  createdAt: toISO(comment.createdAt)!,
  updatedAt: toISO(comment.updatedAt)!,
});
