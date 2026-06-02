/**
 * Service applicatif — gestion des utilisateurs.
 *
 * Couvre : inscription, connexion (email/password + Google OAuth),
 * rotation des refresh tokens, déconnexion, recherche d'utilisateurs.
 *
 * Dépendances : Prisma (User, Session, Role, Salon), JWT utils, bcrypt utils.
 */
import { GoogleLoginDTO } from '../../data/dto/login.dto'
import LoginDTO from '../../data/dto/login.dto'
import { toUserDTO } from '../../data/dto/mappers/user.mappers'
import { UserDTO } from '../../data/dto/user.dto'
import { ApiError } from '../../data/exception/api.exception'
import { PrismaExceptionHandler } from '../../data/exception/prisma.execption.handler'
import { prisma } from '../../repository'
import { signAccess } from '../../utils/jwt'
import { genRefresh } from '../../utils/token'
import { compareText, hashText, isLegacyHash } from '../technical/crypt.ts'

/** Durée de validité d'un refresh token : 7 jours en ms. */
const REFRESH_TTL_MS = 7 * 24 * 3600 * 1000

/**
 * Inscrit un nouvel utilisateur (self-signup).
 * Crée le compte, ouvre une session et retourne les tokens directement
 * pour que le client puisse enchaîner sans repasser par /login.
 *
 * @param user - Données de l'utilisateur à créer.
 * @returns `{ accessToken, refreshToken }`
 * @throws ApiError(409) si l'email est déjà utilisé.
 * @throws ApiError(500) si le rôle USER n'est pas seedé.
 */
export const addUser = async (user: UserDTO & { deviceInfo?: string }) => {
  const existing = await prisma.user.findUnique({ where: { email: user.email } })
  if (existing) {
    throw new ApiError(409, 'account_already_exist', 'Inscription error')
  }

  let roleId = user.roleId
  if (!roleId) {
    const userRole = await prisma.role.findFirst({ where: { name: 'USER' } })
    if (!userRole)
      throw new ApiError(500, 'USER role not seeded', 'role_missing')
    roleId = userRole.id
  }

  const salonOfficiel = await prisma.salon.findFirst({
    where: { title: 'Annonce officielle' },
  })

  const hashed = await hashText(user.password ?? '')
  try {
    const newUser = await prisma.user.create({
      include: { role: true },
      data: {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber,
        password: hashed,
        active: true,
        birthDate: user.birthDate ? new Date(user.birthDate) : new Date(),
        roleId,
        ownedConversations: {
          create: {
            title: 'Assistant IA',
            type: 'AI_CHAT',
            messages: {
              create: {
                content: "Bonjour, comment puis-je vous aidez aujourd'hui?",
                sender: 'AI',
                type: 'TEXT',
              },
            },
          },
        },
        ...(salonOfficiel
          ? {
              salonMembers: {
                create: { role: 'MEMBER', salonId: salonOfficiel.id },
              },
            }
          : {}),
      },
    })

    const refreshToken = genRefresh()
    const expiresAt = new Date(Date.now() + REFRESH_TTL_MS)
    await prisma.session.create({
      data: {
        refreshToken,
        userId: newUser.id,
        expiresAt,
        deviceInfo: user.deviceInfo,
      },
    })
    const accessToken = signAccess(toUserDTO(newUser))

    return {
      success: true,
      data: { accessToken, refreshToken },
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create user error')
  }
}

/**
 * Authentifie un utilisateur par email/mot de passe.
 *
 * Corrige deux failles :
 * 1. Énumération d'utilisateurs : même message d'erreur générique que le mot de passe incorrect.
 * 2. Compte inactif : les comptes désactivés ne peuvent pas se connecter.
 *
 * Migration transparente SHA-256 → bcrypt : si le hash stocké est un SHA-256 legacy,
 * il est automatiquement remplacé par un hash bcrypt après connexion réussie.
 *
 * @param credentials - Email, mot de passe et info appareil.
 * @returns `{ accessToken, refreshToken }`
 * @throws ApiError(401) si les identifiants sont invalides ou le compte inactif.
 */
export const logUser = async ({ email, password, deviceInfo }: LoginDTO) => {
  const user = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  })

  // Message d'erreur générique — évite l'énumération d'emails valides
  const invalidCredentials = new ApiError(401, 'Invalid credentials', 'auth_error')

  if (!user) throw invalidCredentials

  // Compte désactivé : bloquer la connexion
  if (!user.active) {
    throw new ApiError(403, 'Account disabled', 'account_disabled')
  }

  const isValid = await compareText(password, user.password)
  if (!isValid) throw invalidCredentials

  // Migration transparente SHA-256 → bcrypt
  if (isLegacyHash(user.password)) {
    const newHash = await hashText(password)
    await prisma.user.update({ where: { id: user.id }, data: { password: newHash } })
  }

  const refreshToken = genRefresh()
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS)
  try {
    await prisma.session.create({
      data: { refreshToken, userId: user.id, expiresAt, deviceInfo },
    })
    const accessToken = signAccess(toUserDTO(user))
    return {
      success: true,
      data: { accessToken, refreshToken },
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create session')
  }
}

/**
 * Authentifie (ou crée) un utilisateur via Google OAuth.
 *
 * Le token Google ID (`googleToken`) doit être vérifié côté front avant d'appeler
 * cet endpoint — le back fait confiance à l'email fourni uniquement via HTTPS.
 *
 * @remarks
 * Le compte est créé avec un mot de passe vide (connexion Google uniquement).
 * Les comptes désactivés ne peuvent pas se connecter.
 *
 * @param dto - Données Google OAuth (email, prénom, nom, photo, device).
 * @returns `{ accessToken, refreshToken }`
 * @throws ApiError(403) si le compte est inactif.
 */
const logGoogleUser = async ({
  email,
  given_name,
  family_name,
  deviceInfo,
  picture,
}: GoogleLoginDTO) => {
  const userRole = await prisma.role.findFirst({ where: { name: 'USER' } })
  if (!userRole) throw new ApiError(500, 'USER role not seeded', 'role_missing')

  let localUser = await prisma.user.findUnique({
    where: { email },
    include: { role: true },
  })

  if (!localUser) {
    const salonOfficiel = await prisma.salon.findFirst({
      where: { title: 'Annonce officielle' },
    })
    try {
      localUser = await prisma.user.create({
        include: { role: true },
        data: {
          firstName: family_name,
          lastName: given_name,
          password: '',
          phoneNumber: '+261000000',
          email,
          birthDate: new Date(),
          ownedConversations: {
            create: {
              title: 'Assistant IA',
              type: 'AI_CHAT',
              messages: {
                create: {
                  content: "Bonjour, comment puis-je vous aidez aujourd'hui?",
                  sender: 'AI',
                  type: 'TEXT',
                },
              },
            },
          },
          pdpUrl: picture,
          roleId: userRole.id,
          ...(salonOfficiel
            ? { salonMembers: { create: { role: 'MEMBER', salonId: salonOfficiel.id } } }
            : {}),
        },
      })
    } catch (error) {
      const newError = PrismaExceptionHandler.handle(error)
      throw new ApiError(500, newError.message, 'create user error')
    }
  }

  if (!localUser.active) {
    throw new ApiError(403, 'Account disabled', 'account_disabled')
  }

  const refreshToken = genRefresh()
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS)
  try {
    await prisma.session.create({
      data: { refreshToken, userId: localUser.id, expiresAt, deviceInfo },
    })
    const accessToken = signAccess(toUserDTO(localUser))
    return {
      success: true,
      data: { accessToken, refreshToken },
    }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'create session')
  }
}

/**
 * Génère une nouvelle paire de tokens depuis un refresh token valide (rotation).
 * L'ancien refresh token est invalidé immédiatement.
 *
 * @param oldRefresh - Refresh token actuel.
 * @returns `{ accessToken, refreshToken }` — nouvelle paire.
 * @throws ApiError(401) si le token est invalide ou expiré.
 */
export const refreshToken = async (oldRefresh: string) => {
  const session = await prisma.session.findUnique({
    where: { refreshToken: oldRefresh },
    include: { user: { include: { role: true } } },
  })

  if (!session || session.expiresAt < new Date())
    throw new ApiError(401, 'Invalid or expired refresh token', 'Token error')

  const newRefresh = genRefresh()
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS)
  await prisma.session.update({
    where: { id: session.id },
    data: { refreshToken: newRefresh, expiresAt },
  })

  const accessToken = signAccess(toUserDTO(session.user))
  return { accessToken, refreshToken: newRefresh }
}

/**
 * Révoque un refresh token et met fin à la session utilisateur.
 *
 * @param refreshToken - Token à supprimer.
 * @returns Confirmation de déconnexion.
 */
export const logOut = async (refreshToken: string) => {
  try {
    await prisma.session.delete({ where: { refreshToken } })
    return { success: true, message: 'user logged out with success' }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'logout error')
  }
}

/**
 * Recherche des utilisateurs actifs par mot-clé avec pagination.
 * Exclut l'utilisateur courant des résultats.
 * Utilise `$queryRaw` avec paramètres liés (pas d'injection SQL possible).
 *
 * @param keyword - Terme de recherche (firstName, lastName, email, phoneNumber).
 * @param page - Numéro de page (≥ 1).
 * @param pageSize - Nombre de résultats par page.
 * @param userId - ID de l'utilisateur courant (exclu des résultats).
 * @returns Liste paginée d'utilisateurs (sans champ password).
 */
export const searchUsersWithPagination = async (
  keyword: string,
  page: number = 1,
  pageSize: number = 10,
  userId: string
) => {
  if (page < 1) {
    throw new ApiError(400, 'Le numéro de page doit être supérieur à 0', 'pagination_error')
  }
  const searchTerm = keyword?.trim().toLocaleLowerCase()
  const isEmptySearch = !searchTerm || searchTerm.length === 0
  const skip = (page - 1) * pageSize

  let users
  let totalCount = 0
  try {
    const whereClause = { active: true, NOT: { id: userId } }
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
        orderBy: { createdAt: 'desc' },
      })
      totalCount = await prisma.user.count({ where: whereClause })
    } else {
      const pattern = `%${searchTerm}%`
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
        AND (
          LOWER("firstName") LIKE ${pattern}
          OR LOWER("lastName") LIKE ${pattern}
          OR LOWER("email")    LIKE ${pattern}
          OR "phoneNumber"     LIKE ${pattern}
        )
      `
      totalCount = Number(rawCount[0].count)
    }
    const totalPages = Math.ceil(totalCount / pageSize)

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
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'search_users_error')
  }
}

/**
 * Récupère le profil complet d'un utilisateur sans exposer le hash du mot de passe.
 *
 * @param userId - ID de l'utilisateur.
 * @returns Données du profil (sans champ password).
 */
const getUserProfile = async (userId: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        phoneNumber: true,
        birthDate: true,
        createdAt: true,
        pdpUrl: true,
        active: true,
        roleId: true,
        role: true,
      },
    })

    return { success: true, data: user as unknown as UserDTO }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on get user profile')
  }
}

/**
 * Recherche des utilisateurs par liste de mots-clés (noms ou emails).
 * Utilise `$queryRaw` avec paramètres liés (pas d'injection SQL possible).
 *
 * @param keys - Liste de termes de recherche.
 * @returns Utilisateurs correspondants (sans champ password).
 */
const getUsersByName = async (keys: string[]) => {
  try {
    if (!keys.length || !keys[0].length) return { success: true, data: [] }
    const patterns = keys.map(k => `%${k.toLocaleLowerCase()}%`)

    const users = await prisma.$queryRaw<UserDTO[]>`
      SELECT id, "firstName", "lastName", email, "phoneNumber", "birthDate", "createdAt"
      FROM   "User"
      WHERE  EXISTS (
              SELECT 1
              FROM   UNNEST(ARRAY[${patterns}]::text[]) AS pat
              WHERE  LOWER("firstName") LIKE pat
              OR     LOWER("lastName")  LIKE pat
              OR     LOWER(email)       LIKE pat
              OR     "phoneNumber"      LIKE pat
            )
      ORDER  BY "firstName" ASC, "lastName" ASC`
    return { success: true, data: users }
  } catch (error) {
    const newError = PrismaExceptionHandler.handle(error)
    throw new ApiError(500, newError.message, 'error on get user by name')
  }
}

export default {
  addUser,
  logUser,
  refreshToken,
  logOut,
  logGoogleUser,
  searchUsersWithPagination,
  getUserProfile,
  getUsersByName,
}
