import { ConversationDTO, ConversationType } from '../../data/dto/conversation.dto'
import LoginDTO, { GoogleLoginDTO } from '../../data/dto/login.dto'
import { toUserDTO } from '../../data/dto/mappers/user.mappers'
import { UserDTO, UserRequestDTO } from '../../data/dto/user.dto'
import { ApiError } from '../../data/exception/api.exception'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'
import { prisma } from '../../repository'
import { signAccess } from '../../utils/jwt'
import { genRefresh } from '../../utils/token'
import { hashText } from '../technical/crypt.ts'

/**
 * Ajout d'un nouvel utilisateur
 * @param user informations sur l'utilisateur
 * @returns
 */
export const addUser = async (user: UserRequestDTO) => {
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
        ownedConversations : {
          create : {
            title : 'Assistant IA',
            type : 'AI_CHAT',
            messages : {
              create : {
                content : 'Bonjour, comment puis-je vous aidez aujourd\'hui?',
                sender : 'AI',
                type : 'TEXT',
              }
            }
          }
        }
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
  if (!user) {
    throw new ApiError(401,'User not found','Invalid credentials');
  }
  const hashPass = await hashText(password);
  
  if (! (hashPass === user.password)){
    throw new ApiError(401,'Wrong password','Invalid credentials')
  }
  const refreshToken = genRefresh();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  try {
    await prisma.session.create({
      data: { refreshToken, userId: user.id, expiresAt,deviceInfo },
    });
    const accessToken = signAccess(toUserDTO(user));
    return {
      success : true,
      data :  {accessToken, refreshToken}
    };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500,newError.message,'create session')
  }
}

const logGoogleUser = async({email,given_name,family_name,deviceInfo} : GoogleLoginDTO)=> {
  let localUser = await prisma.user.findUnique({where : {email}})
  if(!localUser){ //create user
    try {
      const newUser = await prisma.user.create({
        data: {
          firstName : family_name,
          lastName : given_name,
          password : '',
          phoneNumber : '+261000000',
          email : email,
          birthDate: new Date(),
          ownedConversations : {
            create : {
              title : 'Assistant IA',
              type : 'AI_CHAT',
              messages : {
                create : {
                  content : 'Bonjour, comment puis-je vous aidez aujourd\'hui?',
                  sender : 'AI',
                  type : 'TEXT',
                }
              },
            }
          }
        }
      })
      // if (newUser.active === false) {
      //   return {
      //     success: false,
      //     statusCode: 403,
      //     message: `L'utilisateur ${newUser.lastName} est inactif. Veuillez contacter l'administrateur pour l'activation!!`
      //   }
      // }
      localUser = newUser
    } catch (error) {
      const newError = PrismaExceptionHandler.handle(error)
      throw new ApiError(500,newError.message,'create user error')
    }
  }
  const refreshToken = genRefresh();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  try {
    await prisma.session.create({
      data: { refreshToken, userId: localUser.id, expiresAt,deviceInfo },
    });
    const accessToken = signAccess(toUserDTO(localUser));
    return {
      success : true,
      data :  {accessToken, refreshToken}
    };
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500,newError.message,'create session')
  }
}

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

  // Nouvelle session
  const newRefresh = genRefresh();
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);
  await prisma.session.update({
    where:{id:session.id},
    data : {
      refreshToken : newRefresh,
      expiresAt
    }
  })

  const accessToken = signAccess(toUserDTO(session.user));
  return { accessToken, refreshToken: newRefresh };
}

/**
 * fonction de deconnexion
 * @param refreshToken 
 * @returns 
 */
export const logOut = async (refreshToken:string) => {
  try {
    await prisma.session.delete({ where: { refreshToken } });
    return {
      success: true,
      message : 'user logged out with success'
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500,newError.message,'create session')
  }
}

/**
 * Rechercher des utilisateurs avec pagination
 * @param keyword mot-clé de recherche (si vide, retourne les derniers utilisateurs)
 * @param page numéro de page (commence à 1)
 * @param pageSize nombre de résultats par page
 * @param userId ID de l'utilisateur qui effectue la recherche (optionnel)
 * @returns liste paginée des utilisateurs correspondants
 */
export const searchUsersWithPagination = async (
  keyword: string,
  page: number = 1,
  pageSize: number = 10,
  userId: string
) => {
  console.log({userId});
  
  if (page < 1) {
    throw new ApiError(400, 'Le numéro de page doit être supérieur à 0', 'pagination_error')
  }
  const searchTerm = keyword?.trim().toLocaleLowerCase()
  const isEmptySearch = !searchTerm || searchTerm.length === 0
  const skip = (page - 1) * pageSize
  
  let users
  let totalCount =0
  try {
    const whereClause: any = {
      active : true,
      NOT : { id: userId }
    }
    if (isEmptySearch) {
      users = await prisma.user.findMany({
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
      })
      totalCount = await prisma.user.count({ where: whereClause })
    }else {
      const pattern   = `%${searchTerm}%`;
      users = await prisma.$queryRaw`
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
      `
      const rawCount = await prisma.$queryRaw<[{ count: bigint }]>`
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
    `
      totalCount = Number(rawCount[0].count)
    }
    const totalPages = Math.ceil(totalCount / pageSize)
    console.log({users});
    

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
    }
  } catch (error) {
    console.error(error)
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'search_users_error')
  }
}

export default {
  addUser,
  logUser,
  refreshToken,
  logOut,
  logGoogleUser,
  searchUsersWithPagination
}