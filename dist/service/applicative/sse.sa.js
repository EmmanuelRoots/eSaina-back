"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = require("crypto");
const repository_1 = require("../../repository");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const api_exception_1 = require("../../data/exception/api.exception");
const clients = new Map();
const addClient = (userId, res) => {
    const clientId = (0, crypto_1.randomUUID)();
    clients.set(clientId, { userId, res });
    return clientId;
};
const removeClient = (clientId) => {
    clients.delete(clientId);
};
const sendEventToUser = async ({ userId, type, title, read, message, data }) => {
    try {
        const notification = await repository_1.prisma.notification.create({
            data: {
                userId,
                type,
                title,
                read,
                message,
                data,
            },
        });
        clients.forEach(({ userId: clientUserId, res }) => {
            if (clientUserId === userId && !res.writableEnded) {
                res.write(`event: ${type}\n`);
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            }
        });
        return {
            success: true,
            data: notification
        };
    }
    catch (error) {
        console.error({ error });
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'create notification');
    }
};
const broadcastEvent = (event, data) => {
    clients.forEach(({ res }) => {
        if (!res.writableEnded) {
            res.write(`event: ${event}\n`);
            res.write(`data: ${JSON.stringify(data)}\n\n`);
        }
    });
};
const getUserNotifications = async (userId, limit) => {
    try {
        const notifications = await repository_1.prisma.notification.findMany({
            where: { userId },
            take: limit,
            orderBy: { createdAt: 'desc' },
        });
        return {
            success: true,
            data: notifications
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'create session');
    }
};
exports.default = {
    addClient,
    removeClient,
    sendEventToUser,
    broadcastEvent,
    getUserNotifications
};
