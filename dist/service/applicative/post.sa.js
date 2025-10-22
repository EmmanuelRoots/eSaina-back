"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_dto_1 = require("../../data/dto/notification.dto");
const api_exception_1 = require("../../data/exception/api.exception");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const repository_1 = require("../../repository");
const sse_sa_1 = __importDefault(require("./sse.sa"));
const createPost = async ({ author, content, mediaUrls, salon, type }) => {
    try {
        const res = await repository_1.prisma.post.create({
            data: {
                content: content ?? '',
                authorId: author?.id,
                salonId: salon?.id,
                type,
                mediaUrls
            },
            include: {
                author: true
            }
        });
        sse_sa_1.default.broadcastEvent(notification_dto_1.NotificationType.BROADCAST, { title: `${author?.firstName + ' ' + author?.lastName}'s post`, post: res, type: notification_dto_1.NotificationType.NEW_POST }, author);
        return {
            success: true,
            data: res
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on get user profile');
    }
};
const getPostSalon = async (salonId, page, limit) => {
    console.log({ page, limit });
    if (!salonId)
        throw new api_exception_1.ApiError(500, "salon id missing");
    const skip = (page - 1) * limit;
    try {
        const [posts, total] = await repository_1.prisma.$transaction([
            repository_1.prisma.post.findMany({
                where: {
                    salonId
                },
                include: {
                    reactions: true,
                    author: true,
                    comments: true,
                },
                orderBy: {
                    createdAt: "desc"
                },
                skip,
                take: limit,
            }),
            repository_1.prisma.post.count({ where: { salonId } }),
        ]);
        return {
            success: true,
            data: posts,
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
        throw new api_exception_1.ApiError(500, newError.message, 'error on get user profile');
    }
};
const createReaction = async (payload, userId) => {
    try {
        const res = await repository_1.prisma.reaction.create({
            data: {
                type: payload.type,
                commentId: payload.comment.id ?? '',
                userId,
                postId: payload.post.id ?? '',
            }
        });
        return {
            success: true,
            data: res
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on create reaction');
    }
};
exports.default = {
    createPost,
    getPostSalon,
    createReaction
};
