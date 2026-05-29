import { StatusCategory } from "@prisma/client";
import { CreateProjectStatusRequestDTO, UpdateProjectStatusRequestDTO } from "../../data/dto/project-status.dto";
import { toProjectStatusDTO } from "../../data/dto/mappers/project-status.mappers";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";

const createStatus = async (projectId: string, payload: CreateProjectStatusRequestDTO) => {
  try {
    const res = await prisma.projectStatus.create({
      data: {
        projectId,
        name: payload.name,
        color: payload.color,
        position: payload.position ?? 0,
        category: payload.category ?? StatusCategory.TODO,
      },
    });
    return { success: true, data: toProjectStatusDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on create status");
  }
};

const updateStatus = async (statusId: string, payload: UpdateProjectStatusRequestDTO) => {
  try {
    const res = await prisma.projectStatus.update({
      where: { id: statusId },
      data: {
        name: payload.name,
        color: payload.color,
        position: payload.position,
        category: payload.category,
      },
    });
    return { success: true, data: toProjectStatusDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on update status");
  }
};

const deleteStatus = async (statusId: string) => {
  try {
    await prisma.projectStatus.delete({ where: { id: statusId } });
    return { success: true, message: "status deleted" };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on delete status");
  }
};

const listStatuses = async (projectId: string) => {
  try {
    const res = await prisma.projectStatus.findMany({
      where: { projectId },
      orderBy: { position: "asc" },
    });
    return { success: true, data: res.map(toProjectStatusDTO) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list statuses");
  }
};

const reorderStatuses = async (projectId: string, statusIds: string[]) => {
  try {
    await prisma.$transaction(
      statusIds.map((id, index) =>
        prisma.projectStatus.update({
          where: { id, projectId },
          data: { position: index },
        })
      )
    );
    return { success: true, message: "statuses reordered" };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on reorder statuses");
  }
};

export default {
  createStatus,
  updateStatus,
  deleteStatus,
  listStatuses,
  reorderStatuses,
};
