"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.refreshToken = exports.logUser = exports.addUser = void 0;
const user_mappers_1 = require("../../data/dto/mappers/user.mappers");
const api_exception_1 = require("../../data/exception/api.exception");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const repository_1 = require("../../repository");
const jwt_1 = require("../../utils/jwt");
const token_1 = require("../../utils/token");
const crypt_ts_1 = require("../technical/crypt.ts");
/**
 * Ajout d'un nouvel utilisateur
 * @param user informations sur l'utilisateur
 * @returns
 */
const addUser = async (user) => {
    const localUser = await repository_1.prisma.user.findFirst({ where: { email: user.email, active: true } });
    if (localUser) {
        throw new api_exception_1.ApiError(400, 'account_already_exist');
    }
    const hashed = await (0, crypt_ts_1.hashText)(user.password ?? '');
    try {
        const newUser = await repository_1.prisma.user.create({
            data: {
                ...user,
                password: hashed,
                birthDate: user.birthDate ? new Date(user.birthDate) : new Date(),
                ownedConversations: {
                    create: {
                        title: 'Assistant IA',
                        type: 'AI_CHAT',
                        messages: {
                            create: {
                                content: 'Bonjour, comment puis-je vous aidez aujourd\'hui?',
                                sender: 'AI',
                                type: 'TEXT',
                            }
                        }
                    }
                }
            }
        });
        if (newUser.active === false) {
            return {
                success: false,
                statusCode: 403,
                message: `L'utilisateur ${newUser.lastName} est inactif. Veuillez contacter l'administrateur pour l'activation!!`
            };
        }
        return {
            success: true,
            statusCode: 200,
            data: newUser.id
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'create user error');
    }
};
exports.addUser = addUser;
/**
 * Authentifier un utilisateur
 * @param credentials informations de connexion de l'utilisateur
 * @returns
 */
const logUser = async ({ email, password, deviceInfo }) => {
    const user = await repository_1.prisma.user.findUnique({ where: { email } });
    if (!user) {
        throw new api_exception_1.ApiError(401, 'User not found', 'Invalid credentials');
    }
    const hashPass = await (0, crypt_ts_1.hashText)(password);
    if (!(hashPass === user.password)) {
        throw new api_exception_1.ApiError(401, 'Wrong password', 'Invalid credentials');
    }
    const refreshToken = (0, token_1.genRefresh)();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    try {
        await repository_1.prisma.session.create({
            data: { refreshToken, userId: user.id, expiresAt, deviceInfo },
        });
        const accessToken = (0, jwt_1.signAccess)((0, user_mappers_1.toUserDTO)(user));
        return {
            success: true,
            data: { accessToken, refreshToken }
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'create session');
    }
};
exports.logUser = logUser;
const logGoogleUser = async ({ email, given_name, family_name, deviceInfo }) => {
    let localUser = await repository_1.prisma.user.findUnique({ where: { email } });
    if (!localUser) { //create user
        try {
            const newUser = await repository_1.prisma.user.create({
                data: {
                    firstName: family_name,
                    lastName: given_name,
                    password: '',
                    phoneNumber: '+261000000',
                    email: email,
                    birthDate: new Date(),
                    ownedConversations: {
                        create: {
                            title: 'Assistant IA',
                            type: 'AI_CHAT',
                            messages: {
                                create: {
                                    content: 'Bonjour, comment puis-je vous aidez aujourd\'hui?',
                                    sender: 'AI',
                                    type: 'TEXT',
                                }
                            },
                        }
                    }
                }
            });
            // if (newUser.active === false) {
            //   return {
            //     success: false,
            //     statusCode: 403,
            //     message: `L'utilisateur ${newUser.lastName} est inactif. Veuillez contacter l'administrateur pour l'activation!!`
            //   }
            // }
            localUser = newUser;
            // return {
            //   success: true,
            //   statusCode: 200,
            //   data: newUser.id
            // }
        }
        catch (error) {
            const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
            throw new api_exception_1.ApiError(500, newError.message, 'create user error');
        }
    }
    const refreshToken = (0, token_1.genRefresh)();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    try {
        await repository_1.prisma.session.create({
            data: { refreshToken, userId: localUser.id, expiresAt, deviceInfo },
        });
        const accessToken = (0, jwt_1.signAccess)((0, user_mappers_1.toUserDTO)(localUser));
        return {
            success: true,
            data: { accessToken, refreshToken }
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'create session');
    }
};
/**
 * générer un nouveau token pour l'utilisateur
 * @param token ancien token
 * @returns
 */
const refreshToken = async (oldRefresh) => {
    console.log('call refresh token', oldRefresh);
    const session = await repository_1.prisma.session.findUnique({
        where: { refreshToken: oldRefresh },
        include: { user: true },
    });
    if (!session || session.expiresAt < new Date())
        throw new api_exception_1.ApiError(401, 'Invalid or expired refresh token', 'Token error');
    // Rotation : on supprime l’ancienne session
    await repository_1.prisma.session.delete({ where: { id: session.id } });
    // Nouvelle session
    const newRefresh = (0, token_1.genRefresh)();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await repository_1.prisma.session.create({
        data: { refreshToken: newRefresh, userId: session.userId, expiresAt },
    });
    const accessToken = (0, jwt_1.signAccess)((0, user_mappers_1.toUserDTO)(session.user));
    return { accessToken, refreshToken: newRefresh };
};
exports.refreshToken = refreshToken;
/**
 * fonction de deconnexion
 * @param refreshToken
 * @returns
 */
const logOut = async (refreshToken) => {
    try {
        await repository_1.prisma.session.delete({ where: { refreshToken } });
        return {
            success: true,
            message: 'user logged out with success'
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'create session');
    }
};
exports.logOut = logOut;
exports.default = {
    addUser: exports.addUser,
    logUser: exports.logUser,
    refreshToken: exports.refreshToken,
    logOut: exports.logOut,
    logGoogleUser
};
