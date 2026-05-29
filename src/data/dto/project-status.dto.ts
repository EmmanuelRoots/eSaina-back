import { StatusCategory } from "@prisma/client";

export interface ProjectStatusDTO {
  id: string;
  projectId: string;
  name: string;
  color: string;
  position: number;
  category: StatusCategory;
}

export interface CreateProjectStatusRequestDTO {
  name: string;
  color?: string;
  position?: number;
  category?: StatusCategory;
}

export interface UpdateProjectStatusRequestDTO {
  name?: string;
  color?: string;
  position?: number;
  category?: StatusCategory;
}
