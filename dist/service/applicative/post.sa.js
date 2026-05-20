"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const notification_dto_1 = require("../../data/dto/notification.dto");
const api_exception_1 = require("../../data/exception/api.exception");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const repository_1 = require("../../repository");
const tree_utils_1 = require("../../utils/tree.utils");
const sse_sa_1 = __importDefault(require("./sse.sa"));
const createPost = async ({ author, content, mediaUrls, salon, type, }) => {
    try {
        const res = await repository_1.prisma.post.create({
            data: {
                content: content ?? '',
                authorId: author?.id,
                salonId: salon?.id,
                type,
                mediaUrls,
            },
            include: {
                author: true,
            },
        });
        sse_sa_1.default.broadcastEvent(notification_dto_1.NotificationType.BROADCAST, {
            title: `${author?.firstName + ' ' + author?.lastName}'s post`,
            post: res,
            type: notification_dto_1.NotificationType.NEW_POST,
        }, author);
        return {
            success: true,
            data: res,
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on get user profile');
    }
};
const getPostSalon = async (salonId, page, limit) => {
    if (!salonId)
        throw new api_exception_1.ApiError(500, 'salon id missing');
    const skip = (page - 1) * limit;
    try {
        const [posts, total] = await repository_1.prisma.$transaction([
            repository_1.prisma.post.findMany({
                where: {
                    salonId,
                },
                include: {
                    reactions: {
                        include: {
                            user: true,
                        },
                    },
                    author: true,
                    comments: {
                        select: {
                            id: true,
                        },
                    },
                },
                orderBy: {
                    createdAt: 'desc',
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
            },
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
                commentId: payload.comment?.id ?? undefined,
                userId,
                postId: payload.post?.id ?? undefined,
            },
            include: {
                user: true,
            },
        });
        return {
            success: true,
            data: res,
        };
    }
    catch (error) {
        console.error(error);
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on create reaction');
    }
};
const deleteReaction = async (id) => {
    try {
        const res = await repository_1.prisma.reaction.delete({
            where: {
                id,
            },
        });
        return {
            success: true,
            message: 'reaction deleted with success',
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on delete reaction');
    }
};
const createComment = async (payload, authorId) => {
    try {
        const res = await repository_1.prisma.comment.create({
            data: {
                content: payload.content,
                authorId,
                parentId: payload.parent?.id ?? undefined,
                postId: payload.post.id,
            },
            include: {
                author: true,
                post: true,
            },
        });
        return {
            success: true,
            data: res,
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on create comment');
    }
};
const getComments = async (postId) => {
    try {
        const res = await repository_1.prisma.comment.findMany({
            where: {
                postId,
            },
            include: {
                post: true,
                author: true,
                reactions: {
                    include: {
                        user: true,
                        comment: true,
                    },
                },
            },
        });
        return {
            success: true,
            data: (0, tree_utils_1.buildTree)(res),
            total: res.length,
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on create comment');
    }
};
exports.default = {
    createPost,
    getPostSalon,
    createReaction,
    deleteReaction,
    createComment,
    getComments,
};
