"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = exports.getProfileFromToken = exports.logUser = exports.addUser = void 0;
const repository_1 = require("../../repository");
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
    // const localUser = await prisma.user.findFirst({ where: { email: user.email, active: true } })
    // if (!localUser) {
    //   const password = user.password ? await hashText(user.password) : ''
    //   let entityIds = user.entityIds || []
    //   let roleId = user.roleId ? user.roleId : ''
    //   if (entityIds.length === 0) {
    //     const isFirstUser =
    //       (await prisma.user.count({
    //         where: {
    //           active: true
    //         }
    //       })) === 0
    //     let defaultEntity: any
    //     let defaultRole: any
    //     if (isFirstUser) {
    //       defaultEntity = await getMainEntity()
    //       defaultRole = await prisma.role.findFirst({
    //         orderBy: {
    //           index: 'asc'
    //         }
    //       })
    //       user.active = true
    //       entityIds = defaultEntity ? [defaultEntity.uuid] : []
    //       roleId = defaultRole ? defaultRole.uuid : ''
    //     } else {
    //       defaultEntity = await getDefaultEntity()
    //       defaultRole = await prisma.role.findMany({
    //         orderBy: { index: 'asc' },
    //         skip: 1,
    //         take: 1
    //       })
    //       entityIds = defaultEntity ? [defaultEntity.uuid] : []
    //       roleId = defaultRole ? defaultRole[0].uuid : ''
    //     }
    //   }
    //   const newUser = await prisma.user.create({
    //     data: {
    //       ...user,
    //       password,
    //       visible: user.visible ? true : false,
    //       birthDate: new Date(user.birthDate),
    //       entityIds,
    //       roleId,
    //       enterprise: user.enterprise,
    //       rib: user.rib,
    //       signature: user.signature,
    //       customizedField: user.customizedField
    //     }
    //   })
    //   if (newUser.active === false) {
    //     return {
    //       success: false,
    //       statusCode: 403,
    //       message: `L'utilisateur ${newUser.name} est inactif. Veuillez contacter l'administrateur!!`
    //     }
    //   }
    //   return {
    //     success: true,
    //     statusCode: 200,
    //     data: newUser.uuid
    //   }
    // } else {
    //   throw new ApiError(400, 'account_already_exist')
    // }
};
exports.addUser = addUser;
/**
 * Authentifier un utilisateur
 * @param credentials informations de connexion de l'utilisateur
 * @returns
 */
const logUser = async (credentials) => {
    // const password = await hashText(credentials.password)
    // const localUser = await prisma.user.findUnique({
    //   where: {
    //     email: credentials.email,
    //     password,
    //     active: true,
    //     archived: false
    //   },
    //   include: {
    //     role: {
    //       select: {
    //         uuid: true,
    //         name: true
    //       }
    //     }
    //   }
    // })
    // if (localUser) {
    //   if (localUser.active === false) {
    //     return {
    //       success: false,
    //       statusCode: 403,
    //       message: `L'utilisateur ${localUser.name} est inactif. Veuillez contacter l'administrateur!`
    //     }
    //   }
    //   let token = localUser.token
    //   if (isNewTokenNeeded(localUser)) {
    //     token = await generateToken(localUser.uuid ? localUser.uuid : localUser.email)
    //   }
    //   await prisma.user.update({
    //     where: {
    //       uuid: localUser?.uuid
    //     },
    //     data: {
    //       token,
    //       tokenGeneratedAt: new Date()
    //     }
    //   })
    //   return {
    //     success: true,
    //     message: 'utilisateur authentifié avec succès',
    //     statusCode: 200,
    //     data: {
    //       ...localUser,
    //       token
    //     }
    //   }
    // } else {
    //   throw new ApiError(401, 'wrong_credentials')
    // }
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
/**
 * récupération du profile d'un utilisateur à partir de son token
 * @param token token de l'utilisateur
 * @returns
 */
const getProfileFromToken = async (token) => {
    const localUser = await repository_1.prisma.user.findFirst({
        where: {
            token
        },
        include: {
            role: {
                select: {
                    uuid: true,
                    name: true
                }
            }
        }
    });
    return localUser;
};
exports.getProfileFromToken = getProfileFromToken;
/**
 * générer un nouveau token pour l'utilisateur
 * @param token ancien token
 * @returns
 */
const refreshToken = async (token) => {
    const localUser = await repository_1.prisma.user.findFirst({
        where: {
            token
        },
        include: {
            role: {
                select: {
                    uuid: true,
                    name: true
                }
            }
        }
    });
    // if (localUser) {
    //   if (!isNewTokenNeeded(localUser)) {
    //     console.log('refresh token for api user. current token returned')
    //     return {
    //       success: true,
    //       statusCode: 200,
    //       data: {
    //         ...localUser,
    //         token
    //       }
    //     }
    //   }
    //     const { token: newToken } = await prisma.user.update({
    //       where: { uuid: localUser?.uuid },
    //       data: {
    //         token: await generateToken(localUser.uuid ? localUser.uuid : localUser.email),
    //         tokenGeneratedAt: new Date()
    //       }
    //     })
    //     return {
    //       success: true,
    //       statusCode: 200,
    //       data: {
    //         ...localUser,
    //         token: newToken
    //       }
    //     }
    //   } else {
    //     return {
    //       success: false,
    //       statusCode: 401,
    //       message: 'expired_token'
    //     }
    //   }
};
exports.refreshToken = refreshToken;
exports.default = {
    addUser: exports.addUser,
    logUser: exports.logUser,
    refreshToken: exports.refreshToken,
    // loginOrRegister,
};
