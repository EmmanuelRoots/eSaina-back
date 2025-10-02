"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.logUser = exports.addUser = void 0;
const user_mappers_1 = require("../../data/dto/mappers/user.mappers");
const api_exception_1 = require("../../data/exception/api.exception");
const prisma_execption_handler_1 = require("../../data/exception/prisma.execption.handler");
const repository_1 = require("../../repository");
const jwt_1 = require("../../utils/jwt");
const token_1 = require("../../utils/token");
const crypt_ts_1 = require("../technical/crypt.ts");
// import { isNewTokenNeeded } from '../factory/user.factory'
// import mfaSt from '../technical/mfa.st'
// import { generateExpiredToken, generateToken, hashText } from '../technical/others.st'
// import { default as initializeDriveService } from '../technical/provider/google.st'
// import { getDefaultEntity, getMainEntity } from './entity.sa'
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
    if (!user)
        throw new api_exception_1.ApiError(401, 'User not found', 'Invalid credentials');
    const ok = await (0, crypt_ts_1.hashText)(password);
    if (!ok)
        throw new api_exception_1.ApiError(401, 'Wrong password', 'Invalid credentials');
    const refreshToken = (0, token_1.genRefresh)();
    const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
    await repository_1.prisma.session.create({
        data: { refreshToken, userId: user.id, expiresAt, deviceInfo },
    });
    const accessToken = (0, jwt_1.signAccess)((0, user_mappers_1.toUserDTO)(user));
    return { accessToken, refreshToken };
};
exports.logUser = logUser;
/**
 * Authentifier un utilisateur avec mfa
 * @param credentials informations de connexion de l'utilisateur
 * @returns
 */
// export const loginOrRegister = async (params: mfaDTO) => {
//   const userMfa = await mfaSt.getUserInfoFromGoogle(params.accessToken)
//   if (userMfa) {
//     const localUser = await prisma.user.findUnique({
//       where: {
//         email: userMfa.email,
//         archived: false,
//         active: true
//       },
//       include: {
//         role: {
//           select: {
//             uuid: true,
//             name: true
//           }
//         }
//       }
//     })
//     if (localUser) {
//       let token = localUser.token
//       if (isNewTokenNeeded(localUser)) {
//         token = await generateToken(localUser.uuid ? localUser.uuid : localUser.email)
//       }
//       const currentUser = await prisma.user.update({
//         where: {
//           uuid: localUser?.uuid
//         },
//         data: {
//           token,
//           tokenGeneratedAt: new Date() // tokenGeneratedAt mis à jour à chaque login
//         }
//       })
//       if (currentUser.active === false) {
//         return {
//           success: false,
//           statusCode: 403,
//           message: `L'utilisateur ${currentUser.name} est inactif. Veuillez contacter l'administrateur!!!`
//         }
//       }
//       return {
//         success: true,
//         statusCode: 200,
//         data: {
//           ...localUser,
//           token
//         }
//       }
//     } else {
//       const password = await hashText(new Date().getTime().toString())
//       let entityIds: string[] = []
//       let roleId = ''
//       const isFirstUser =
//         (await prisma.user.count({
//           where: {
//             active: true
//           }
//         })) === 0
//       let defaultEntity: any
//       let defaultRole: any
//       let isActive = false
//       if (isFirstUser) {
//         defaultEntity = await getMainEntity()
//         defaultRole = await prisma.role.findFirst({
//           orderBy: {
//             index: 'asc'
//           }
//         })
//         isActive = true
//         entityIds = defaultEntity ? [defaultEntity.uuid] : []
//         roleId = defaultRole ? defaultRole.uuid : ''
//       } else {
//         defaultEntity = await getDefaultEntity()
//         defaultRole = await prisma.role.findMany({
//           orderBy: { index: 'asc' },
//           skip: 1,
//           take: 1
//         })
//         isActive = false
//         entityIds = defaultEntity ? [defaultEntity.uuid] : []
//         roleId = defaultRole ? defaultRole[0].uuid : ''
//       }
//       const token = await generateToken(userMfa.email)
//       const data = {
//         email: userMfa.email,
//         name: userMfa.family_name ? userMfa.family_name : '' + ' ' + userMfa.given_name ? userMfa.given_name : '',
//         password,
//         visible: true,
//         phoneNumber: '',
//         male: true,
//         active: isActive,
//         birthDate: new Date(),
//         entityIds,
//         roleId,
//         token,
//         tokenGeneratedAt: new Date()
//       }
//       const newUser = await prisma.user.create({
//         data
//       })
//       if (newUser.active === false) {
//         return {
//           success: false,
//           statusCode: 403,
//           message: `L'utilisateur ${newUser.name} est inactif. Veuillez contacter l'administrateur!!!!`
//         }
//       }
//       return {
//         success: true,
//         statusCode: 200,
//         data: {
//           ...newUser,
//           token
//         }
//       }
//     }
//   }
// }
// /**
//  * récupération du profile d'un utilisateur à partir de son token
//  * @param token token de l'utilisateur
//  * @returns
//  */
// export const getProfileFromToken = async (token: string) => {
//   const localUser = await prisma.user.findFirst({
//     where: {
//       token
//     },
//     include: {
//       role: {
//         select: {
//           uuid: true,
//           name: true
//         }
//       }
//     }
//   })
//   return localUser
// }
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
exports.default = {
    addUser: exports.addUser,
    logUser: exports.logUser,
    refreshToken: exports.refreshToken,
    // loginOrRegister,
};
