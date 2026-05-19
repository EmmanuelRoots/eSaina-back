import { Sprint } from "@prisma/client";
import { toISO } from "../../../utils/date.utils";
import { SprintDTO, SprintStatus } from "../sprint.dto";

export const toSprintDTO = (sprint: Sprint): SprintDTO => ({
  id: sprint.id,
  projectId: sprint.projectId,
  name: sprint.name,
  goal: sprint.goal,
  startDate: toISO(sprint.startDate),
  endDate: toISO(sprint.endDate),
  status: sprint.status as SprintStatus,
  createdAt: toISO(sprint.createdAt)!,
  updatedAt: toISO(sprint.updatedAt)!,
});
