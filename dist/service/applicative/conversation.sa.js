"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const conversation_dto_1 = require("../../data/dto/conversation.dto");
const message_dto_1 = require("../../data/dto/message.dto");
const notification_dto_1 = require("../../data/dto/notification.dto");
const api_exception_1 = require("../../data/exception/api.exception");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const repository_1 = require("../../repository");
const n8n_ts_1 = __importDefault(require("../technique/n8n.ts"));
const sse_sa_1 = __importDefault(require("./sse.sa"));
/**
 * get all conversations by user
 * @param userId
 * @returns
 */
const getAllConversationByUser = async (id, page, limit) => {
    console.log({ id, page, limit });
    if (!id)
        throw new api_exception_1.ApiError(500, "user id missing");
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
                    // messages: {
                    //   include : {
                    //     user : true
                    //   },
                    //   take : 10
                    // },
                    members: {
                        include: {
                            user: true
                        }
                    }
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
            conversations: JSON.parse(JSON.stringify(conversations)),
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
const createConversation = async (ownerId, payload) => {
    try {
        const res = await repository_1.prisma.conversation.create({
            data: {
                type: payload.type,
                members: {
                    create: payload.members.map(m => {
                        return {
                            userId: m.userId,
                            role: m.role
                        };
                    })
                },
                ownerId: ownerId,
                title: payload.title,
                read: true,
            }
        });
        sse_sa_1.default.sendEventToUser({ title: "Nouvelle conversation", userId: payload.userId, read: false, type: notification_dto_1.NotificationType.NEW_CONVERSATION, data: res, message: "vous avez une nouvelle conversation" });
        return {
            success: true,
            data: res
        };
    }
    catch (error) {
        console.error(error);
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'error on create conversation');
    }
};
const createMessage = async (payload) => {
    try {
        // 1. Sauvegarde du message utilisateur (toujours)
        const userMessage = await repository_1.prisma.message.create({
            data: {
                content: payload.content,
                conversationId: payload.conversation.id,
                sender: payload.sender,
                userId: payload.user.id,
                type: payload.type,
            },
        });
        // 2. Si c’est un message à l’IA
        if (payload.conversation.type === conversation_dto_1.ConversationType.AI_CHAT) {
            // Appel à n8n
            const aiResponseContent = await n8n_ts_1.default.sendRequest(payload.content, payload.user.id);
            // 3. Sauvegarde de la réponse de l’IA
            const aiMessage = await repository_1.prisma.message.create({
                data: {
                    content: aiResponseContent,
                    conversationId: payload.conversation.id,
                    sender: message_dto_1.SenderType.AI,
                    userId: payload.user.id,
                    type: message_dto_1.MessageType.TEXT, // ou le type adapté
                },
            });
            // 4. Notification à l’utilisateur (propriétaire de la conversation)
            sse_sa_1.default.sendEventToUser({
                title: "Nouveau message",
                userId: payload.conversation.ownerId,
                read: false,
                type: notification_dto_1.NotificationType.NEW_MESSAGE,
                data: aiMessage,
                message: "L’IA a répondu à votre message",
            });
            return {
                success: true,
                data: { userMessage, aiMessage },
            };
        }
        // 5. Si c’est un message humain → notifie les autres membres
        const otherMembers = payload.conversation.members.filter((m) => m.userId !== payload.user.id);
        otherMembers.forEach((m) => {
            sse_sa_1.default.sendEventToUser({
                title: "Nouveau message",
                userId: m.userId,
                read: false,
                type: notification_dto_1.NotificationType.NEW_MESSAGE,
                data: userMessage,
                message: "Vous avez un nouveau message",
            });
        });
        return {
            success: true,
            data: userMessage,
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, "Erreur lors de la création du message");
    }
};
const getAllMessagesByConversation = async (conversationId, page, limit) => {
    if (!conversationId)
        throw new api_exception_1.ApiError(500, "conversation's id missing");
    try {
        const skip = (page - 1) * limit;
        const [messages, total] = await repository_1.prisma.$transaction([
            repository_1.prisma.message.findMany({
                where: {
                    conversationId
                },
                include: {
                    user: true
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            repository_1.prisma.message.count({
                where: {
                    conversationId
                }
            }),
        ]);
        return {
            success: true,
            messages: JSON.parse(JSON.stringify(messages)),
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
        throw new api_exception_1.ApiError(500, newError.message, 'error on get all message by conversation');
    }
};
exports.default = {
    getAllConversationByUser,
    createConversation,
    createMessage,
    getAllMessagesByConversation,
};
