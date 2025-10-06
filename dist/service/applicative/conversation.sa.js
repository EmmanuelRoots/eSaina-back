"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = require("../../data/exception/api.exception");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const repository_1 = require("../../repository");
/**
 * get all conversations by user
 * @param userId
 * @returns
 */
const getAllConversationByUser = async (id, page, limit) => {
    if (!id)
        throw new api_exception_1.ApiError(500, "email missing");
    const skip = (page - 1) * limit;
    try {
        const [conversations, total] = await repository_1.prisma.$transaction([
            repository_1.prisma.conversation.findMany({
                where: {
                    OR: [
                        { ownerId: id },
                        { members: { some: { userId: id } } },
                    ]
                },
                include: {
                    owner: {
                        select: {
                            firstName: true,
                            lastName: true
                        }
                    },
                    messages: true,
                },
                orderBy: { updatedAt: "desc" }, // ou createdAt
                skip,
                take: limit,
            }),
            repository_1.prisma.conversation.count({ where: { OR: [
                        { ownerId: id },
                        { members: { some: { userId: id } } },
                    ] } }),
        ]);
        return {
            success: true,
            data: conversations,
            pagination: {
                page,
                limit,
                total,
                hasMore: skip + limit < total,
            }
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on get all conversation');
    }
};
exports.default = {
    getAllConversationByUser
};
