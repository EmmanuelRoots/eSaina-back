import { CreateLabelRequestDTO } from "../../data/dto/label.dto";
import { ApiError } from "../../data/exception/api.exception";
import { PrismaExceptionHandler } from "../../data/exception/prisma.execption.handler";
import { prisma } from "../../repository";

const createLabel = async (payload: CreateLabelRequestDTO) => {
  try {
    const res = await prisma.label.create({
      data: {
        projectId: payload.projectId,
        name: payload.name,
        color: payload.color,
      },
    });
    return {
      success: true,
      data: { id: res.id, name: res.name, color: res.color },
    };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on create label");
  }
};

const listLabels = async (projectId: string) => {
  try {
    const res = await prisma.label.findMany({
      where: { projectId },
      orderBy: { name: "asc" },
    });
    return {
      success: true,
      data: res.map((l) => ({ id: l.id, name: l.name, color: l.color })),
    };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on list labels");
  }
};

const deleteLabel = async (labelId: string) => {
  try {
    await prisma.label.delete({ where: { id: labelId } });
    return { success: true, message: "label deleted" };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error);
    throw new ApiError(500, newError.message, "error on delete label");
  }
};

export default {
  createLabel,
  listLabels,
  deleteLabel,
};
