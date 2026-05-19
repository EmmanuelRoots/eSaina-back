import {
  CreateSprintRequestDTO,
  SprintStatus,
  UpdateSprintRequestDTO,
} from "../../data/dto/sprint.dto";
import { toSprintDTO } from "../../data/dto/mappers/sprint.mappers";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";

const createSprint = async (payload: CreateSprintRequestDTO) => {
  try {
    const res = await prisma.sprint.create({
      data: {
        projectId: payload.projectId,
        name: payload.name,
        goal: payload.goal,
        startDate: payload.startDate ? new Date(payload.startDate) : null,
        endDate: payload.endDate ? new Date(payload.endDate) : null,
      },
    });
    return { success: true, data: toSprintDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on create sprint");
  }
};

const listSprints = async (projectId: string) => {
  try {
    const res = await prisma.sprint.findMany({
      where: { projectId },
      orderBy: { createdAt: "desc" },
    });
    return { success: true, data: res.map(toSprintDTO) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list sprints");
  }
};

const updateSprint = async (
  sprintId: string,
  payload: UpdateSprintRequestDTO,
) => {
  try {
    const res = await prisma.sprint.update({
      where: { id: sprintId },
      data: {
        name: payload.name,
        goal: payload.goal,
        startDate:
          payload.startDate === undefined
            ? undefined
            : payload.startDate === null
            ? null
            : new Date(payload.startDate),
        endDate:
          payload.endDate === undefined
            ? undefined
            : payload.endDate === null
            ? null
            : new Date(payload.endDate),
        status: payload.status,
      },
    });
    return { success: true, data: toSprintDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on update sprint");
  }
};

const startSprint = async (sprintId: string) => {
  try {
    // Only one active sprint per project at a time.
    const sprint = await prisma.sprint.findUnique({
      where: { id: sprintId },
      select: { projectId: true },
    });
    if (!sprint) throw new ApiError(404, "Sprint not found");

    const active = await prisma.sprint.findFirst({
      where: {
        projectId: sprint.projectId,
        status: SprintStatus.ACTIVE,
        NOT: { id: sprintId },
      },
    });
    if (active) {
      throw new ApiError(
        409,
        "Another sprint is already active for this project",
      );
    }

    const res = await prisma.sprint.update({
      where: { id: sprintId },
      data: { status: SprintStatus.ACTIVE, startDate: new Date() },
    });
    return { success: true, data: toSprintDTO(res) };
  } catch (error) {
    if (error instanceof ApiError) throw error;
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on start sprint");
  }
};

const closeSprint = async (sprintId: string) => {
  try {
    const res = await prisma.sprint.update({
      where: { id: sprintId },
      data: { status: SprintStatus.CLOSED, endDate: new Date() },
    });
    return { success: true, data: toSprintDTO(res) };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on close sprint");
  }
};

const deleteSprint = async (sprintId: string) => {
  try {
    await prisma.sprint.delete({ where: { id: sprintId } });
    return { success: true, message: "sprint deleted" };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on delete sprint");
  }
};

export default {
  createSprint,
  listSprints,
  updateSprint,
  startSprint,
  closeSprint,
  deleteSprint,
};
