import { ProjectStatus } from "@prisma/client";
import { ProjectStatusDTO } from "../project-status.dto";

export const toProjectStatusDTO = (status: ProjectStatus): ProjectStatusDTO => {
  return {
    id: status.id,
    projectId: status.projectId,
    name: status.name,
    color: status.color,
    position: status.position,
    category: status.category,
  };
};
