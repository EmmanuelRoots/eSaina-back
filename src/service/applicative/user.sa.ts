import LoginDTO, { mfaDTO } from '../../data/dto/login.dto'
import { UserDTO } from '../../data/dto/user.dto'
import { ApiError } from '../../data/exception/api.exception'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'
import { prisma } from '../../repository'
import { signAccess } from '../../utils/jwt'
import { genRefresh } from '../../utils/token'
import { hashText } from '../technical/crypt.ts'

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
export const addUser = async (user: UserDTO) => {
  const localUser = await prisma.user.findFirst({ where: { email: user.email, active: true } })
  if(localUser) {
    throw new ApiError(400, 'account_already_exist')
  }
  const hashed = await hashText(user.password ?? '')
  try {
    const newUser = await prisma.user.create({
      data: {
        ...user,
        password : hashed,
        birthDate: user.birthDate? new Date(user.birthDate) : new Date(),
      }
    })
    if (newUser.active === false) {
      return {
        success: false,
        statusCode: 403,
        message: `L'utilisateur ${newUser.lastName} est inactif. Veuillez contacter l'administrateur pour l'activation!!`
      }
    }

    return {
      success: true,
      statusCode: 200,
      data: newUser.id
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500,newError.message,'create user error')
  }
  
}

/**
 * Authentifier un utilisateur
 * @param credentials informations de connexion de l'utilisateur
 * @returns
 */
export const logUser = async ({email,password,deviceInfo}: LoginDTO) => {
  const user  = await prisma.user.findUnique({ where: { email } });
  if (!user) throw new ApiError(401,'User not found','Invalid credentials');
  const ok = await hashText(password);
  if (!ok) throw new ApiError(401,'Wrong password','Invalid credentials');
  const refreshToken = genRefresh();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  await prisma.session.create({
    data: { refreshToken, userId: user.id, expiresAt,deviceInfo },
  });

  const accessToken = signAccess({...user,birthDate:user.birthDate.getTime()});

  return { accessToken, refreshToken };
}
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
export const refreshToken = async (oldRefresh: string) => {
  const session = await prisma.session.findUnique({
    where: { refreshToken: oldRefresh },
    include: { user: true },
  });
  if (!session || session.expiresAt < new Date())
    throw new ApiError(401,'Invalid or expired refresh token','Token error');

  // Rotation : on supprime l’ancienne session
  await prisma.session.delete({ where: { id: session.id } });

  // Nouvelle session
  const newRefresh = genRefresh();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  await prisma.session.create({
    data: { refreshToken: newRefresh, userId: session.userId, expiresAt },
  });

  const accessToken = signAccess({...session.user,birthDate:session.user.birthDate.getTime()});
  return { accessToken, refreshToken: newRefresh };
}

export default {
  addUser,
  logUser,
  refreshToken,
  // loginOrRegister,
}
