"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const api_exception_1 = require("../../data/exception/api.exception");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const repository_1 = require("../../repository");
const getSalonListByUser = async (userId) => {
    try {
        const res = await repository_1.prisma.salon.findMany({
            where: {
                members: {
                    some: {
                        userId
                    }
                }
            }
        });
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
exports.default = {
    getSalonListByUser
};
