import { Project, ProjectMember, User, Salon, Sprint, Label } from "@prisma/client";
import { toISO } from "../../../utils/date.utils";
import { ProjectDTO, ProjectMemberDTO, ProjectMemberRole } from "../project.dto";
import { toUserDTO } from "./user.mappers";
import { toSprintDTO } from "./sprint.mappers";

export const toProjectDTO = (
  project: Project & {
    owner?: User;
    salon?: Salon | null;
    members?: (ProjectMember & { user?: User })[];
    sprints?: Sprint[];
    labels?: Label[];
  },
): ProjectDTO => ({
  id: project.id,
  key: project.key,
  name: project.name,
  description: project.description,
  ownerId: project.ownerId,
  owner: project.owner ? toUserDTO(project.owner) : undefined,
  salonId: project.salonId,
  issueCounter: project.issueCounter,
  members: project.members?.map(toProjectMemberDTO),
  sprints: project.sprints?.map(toSprintDTO),
  labels: project.labels?.map((l) => ({
    id: l.id,
    name: l.name,
    color: l.color,
  })),
  createdAt: toISO(project.createdAt)!,
  updatedAt: toISO(project.updatedAt)!,
});

export const toProjectMemberDTO = (
  member: ProjectMember & { user?: User },
): ProjectMemberDTO => ({
  id: member.id,
  projectId: member.projectId,
  userId: member.userId,
  user: member.user ? toUserDTO(member.user) : undefined,
  role: member.role as ProjectMemberRole,
  joinedAt: toISO(member.joinedAt)!,
});
