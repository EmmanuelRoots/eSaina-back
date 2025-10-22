"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUsersWithPagination = exports.logOut = exports.refreshToken = exports.logUser = exports.addUser = void 0;
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
                },
                roleId: user.roleId
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
const logGoogleUser = async ({ email, given_name, family_name, deviceInfo, picture }) => {
    const userRole = await repository_1.prisma.role.findFirst({
        where: {
            name: 'USER'
        }
    });
    let localUser = await repository_1.prisma.user.findUnique({ where: { email } });
    if (!localUser) { //create user
        const salonOfficiel = await repository_1.prisma.salon.findFirst({
            where: {
                title: 'Annonce officielle'
            }
        });
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
                    },
                    pdpUrl: picture,
                    roleId: userRole?.id,
                    salonMembers: {
                        create: {
                            role: 'MEMBER',
                            salonId: salonOfficiel?.id
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
        }
        catch (error) {
            console.error(error);
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
    const session = await repository_1.prisma.session.findUnique({
        where: { refreshToken: oldRefresh },
        include: { user: true },
    });
    if (!session || session.expiresAt < new Date())
        throw new api_exception_1.ApiError(401, 'Invalid or expired refresh token', 'Token error');
    // Nouvelle session
    const newRefresh = (0, token_1.genRefresh)();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await repository_1.prisma.session.update({
        where: { id: session.id },
        data: {
            refreshToken: newRefresh,
            expiresAt
        }
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
/**
 * Rechercher des utilisateurs avec pagination
 * @param keyword mot-clé de recherche (si vide, retourne les derniers utilisateurs)
 * @param page numéro de page (commence à 1)
 * @param pageSize nombre de résultats par page
 * @param userId ID de l'utilisateur qui effectue la recherche (optionnel)
 * @returns liste paginée des utilisateurs correspondants
 */
const searchUsersWithPagination = async (keyword, page = 1, pageSize = 10, userId) => {
    // console.log({userId});
    if (page < 1) {
        throw new api_exception_1.ApiError(400, 'Le numéro de page doit être supérieur à 0', 'pagination_error');
    }
    const searchTerm = keyword?.trim().toLocaleLowerCase();
    const isEmptySearch = !searchTerm || searchTerm.length === 0;
    const skip = (page - 1) * pageSize;
    let users;
    let totalCount = 0;
    try {
        const whereClause = {
            active: true,
            NOT: { id: userId }
        };
        if (isEmptySearch) {
            users = await repository_1.prisma.user.findMany({
                where: whereClause,
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    phoneNumber: true,
                    birthDate: true,
                    createdAt: true,
                },
                skip,
                take: pageSize,
                orderBy: isEmptySearch
                    ? { createdAt: 'desc' } // Les derniers utilisateurs créés si recherche vide
                    : [
                        { firstName: 'asc' },
                        { lastName: 'asc' },
                    ],
            });
            totalCount = await repository_1.prisma.user.count({ where: whereClause });
        }
        else {
            const pattern = `%${searchTerm}%`;
            users = await repository_1.prisma.$queryRaw `
        SELECT "id", "firstName", "lastName", "email", "phoneNumber", "birthDate", "createdAt"
        FROM   "User"
        WHERE  "active" = true
        AND    "id" != ${userId}
        AND   (
                LOWER("firstName") LIKE ${pattern}
                OR LOWER("lastName") LIKE ${pattern}
                OR LOWER("email")    LIKE ${pattern}
                OR "phoneNumber"     LIKE ${pattern}
              )
        ORDER  BY "firstName" ASC, "lastName" ASC
        LIMIT  ${pageSize}
        OFFSET ${skip};
      `;
            const rawCount = await repository_1.prisma.$queryRaw `
      SELECT COUNT(*) as count
      FROM "User"
      WHERE active = true
      AND "id" != ${userId}
      AND   (
        LOWER("firstName") LIKE ${pattern}
        OR LOWER("lastName") LIKE ${pattern}
        OR LOWER("email")    LIKE ${pattern}
        OR "phoneNumber"     LIKE ${pattern}
      )
    `;
            totalCount = Number(rawCount[0].count);
        }
        const totalPages = Math.ceil(totalCount / pageSize);
        return {
            success: true,
            statusCode: 200,
            data: users,
            pagination: {
                currentPage: page,
                pageSize,
                totalCount,
                totalPages,
                hasNextPage: page < totalPages,
                hasPreviousPage: page > 1,
            },
        };
    }
    catch (error) {
        const newError = prisma_execption_handler_1.PrismaExceptionHandler.handle(error);
        throw new api_exception_1.ApiError(500, newError.message, 'search_users_error');
    }
};
exports.searchUsersWithPagination = searchUsersWithPagination;
const getUserProfile = async (userId) => {
    try {
        const res = await repository_1.prisma.user.findFirst({
            where: {
                id: userId
            },
            include: {
                role: true
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
    addUser: exports.addUser,
    logUser: exports.logUser,
    refreshToken: exports.refreshToken,
    logOut: exports.logOut,
    logGoogleUser,
    searchUsersWithPagination: exports.searchUsersWithPagination,
    getUserProfile
};
