/**
 * Tests unitaires — user.sa.ts
 *
 * Couvre : logUser (énumération, compte inactif, migration bcrypt),
 * addUser (unicité email), refreshToken (rotation), logOut.
 *
 * Prisma est mocké pour éviter toute dépendance à la base de données.
 */
import { ApiError } from '../../src/data/exception/api.exception'

// ── Mocks ─────────────────────────────────────────────────────────────────────
jest.mock('../../src/repository', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    session: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    role: { findFirst: jest.fn() },
    salon: { findFirst: jest.fn() },
  },
}))

jest.mock('../../src/utils/jwt', () => ({
  signAccess: jest.fn(() => 'mock-access-token'),
}))

jest.mock('../../src/utils/token', () => ({
  genRefresh: jest.fn(() => 'mock-refresh-token'),
}))

import { prisma } from '../../src/repository'
import userSa from '../../src/service/applicative/user.sa'
import { createHash } from 'crypto'
import { hashText } from '../../src/service/technical/crypt.ts'

const mockPrismaUser = prisma.user as jest.Mocked<typeof prisma.user>
const mockPrismaSession = prisma.session as jest.Mocked<typeof prisma.session>

/** Construit un utilisateur Prisma de test (champs obligatoires du modèle Prisma User). */
const buildDbUser = (overrides: Record<string, unknown> = {}) => ({
  id: 'user-1',
  email: 'test@esaina.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  phoneNumber: '+261320000000',
  password: '', // sera remplacé dans chaque test
  active: true,
  connected: false,
  birthDate: new Date(),
  createdAt: new Date(),
  pdpUrl: null,
  roleId: 'role-1',
  role: { id: 'role-1', name: 'USER', authorizations: [] },
  ...overrides,
})

beforeAll(() => {
  process.env.ACCESS_TOKEN_SECRET = 'test-secret'
  process.env.ACCESS_TOKEN_TTL = '5m'
})

afterEach(() => jest.clearAllMocks())

// ─────────────────────────────────────────────────────────────────────────────
describe('logUser', () => {
  it('retourne accessToken + refreshToken pour des identifiants valides (bcrypt)', async () => {
    const bcryptHash = await hashText('monMotDePasse')
    mockPrismaUser.findUnique.mockResolvedValue(buildDbUser({ password: bcryptHash }))
    mockPrismaSession.create.mockResolvedValue({} as any)

    const result = await userSa.logUser({
      email: 'test@esaina.com',
      password: 'monMotDePasse',
    })

    expect(result.success).toBe(true)
    expect(result.data.accessToken).toBe('mock-access-token')
    expect(result.data.refreshToken).toBe('mock-refresh-token')
  })

  it('effectue la migration SHA-256 → bcrypt automatiquement', async () => {
    const sha256 = createHash('sha256').update(Buffer.from('legacy', 'utf-8')).digest('hex')
    mockPrismaUser.findUnique.mockResolvedValue(buildDbUser({ password: sha256 }))
    mockPrismaUser.update.mockResolvedValue({} as any)
    mockPrismaSession.create.mockResolvedValue({} as any)

    await userSa.logUser({ email: 'test@esaina.com', password: 'legacy' })

    // La migration doit avoir mis à jour le mot de passe en bcrypt
    expect(mockPrismaUser.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'user-1' },
        data: expect.objectContaining({ password: expect.stringMatching(/^\$2/) }),
      })
    )
  })

  it('lève ApiError 401 avec message générique si l\'utilisateur n\'existe pas', async () => {
    mockPrismaUser.findUnique.mockResolvedValue(null)

    await expect(
      userSa.logUser({ email: 'inconnu@esaina.com', password: 'n\'importe' })
    ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid credentials' })
  })

  it('lève ApiError 401 avec le même message générique pour un mauvais mot de passe', async () => {
    const bcryptHash = await hashText('correct')
    mockPrismaUser.findUnique.mockResolvedValue(buildDbUser({ password: bcryptHash }))

    await expect(
      userSa.logUser({ email: 'test@esaina.com', password: 'mauvais' })
    ).rejects.toMatchObject({ statusCode: 401, message: 'Invalid credentials' })
  })

  it('les messages d\'erreur "user inconnu" et "mauvais mot de passe" sont identiques (anti-énumération)', async () => {
    // Cas 1 : user inexistant
    mockPrismaUser.findUnique.mockResolvedValue(null)
    let err1: ApiError | undefined
    try {
      await userSa.logUser({ email: 'x@x.com', password: 'y' })
    } catch (e) {
      err1 = e as ApiError
    }

    // Cas 2 : mauvais mot de passe
    const hash = await hashText('correct')
    mockPrismaUser.findUnique.mockResolvedValue(buildDbUser({ password: hash }))
    let err2: ApiError | undefined
    try {
      await userSa.logUser({ email: 'test@esaina.com', password: 'wrong' })
    } catch (e) {
      err2 = e as ApiError
    }

    expect(err1?.message).toBe(err2?.message)
    expect(err1?.statusCode).toBe(err2?.statusCode)
  })

  it('lève ApiError 403 si le compte est inactif', async () => {
    const hash = await hashText('pwd')
    mockPrismaUser.findUnique.mockResolvedValue(buildDbUser({ password: hash, active: false }))

    await expect(
      userSa.logUser({ email: 'test@esaina.com', password: 'pwd' })
    ).rejects.toMatchObject({ statusCode: 403, message: 'Account disabled' })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('addUser', () => {
  it('lève ApiError 409 si l\'email existe déjà', async () => {
    mockPrismaUser.findUnique.mockResolvedValue(buildDbUser())

    await expect(
      userSa.addUser({
        email: 'test@esaina.com',
        firstName: 'A',
        lastName: 'B',
        phoneNumber: '+261000',
        roleId: 'r1',
      })
    ).rejects.toMatchObject({ statusCode: 409 })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('refreshToken', () => {
  it('retourne une nouvelle paire de tokens pour une session valide', async () => {
    const futureDate = new Date(Date.now() + 3600_000)
    ;(mockPrismaSession.findUnique as jest.Mock).mockResolvedValue({
      id: 'session-1',
      refreshToken: 'old-token',
      expiresAt: futureDate,
      user: buildDbUser(),
    })
    ;(mockPrismaSession.update as jest.Mock).mockResolvedValue({})

    const result = await userSa.refreshToken('old-token')

    expect(result.accessToken).toBe('mock-access-token')
    expect(result.refreshToken).toBe('mock-refresh-token')
    expect(mockPrismaSession.update).toHaveBeenCalled()
  })

  it('lève ApiError 401 si la session est expirée', async () => {
    const pastDate = new Date(Date.now() - 1000)
    ;(mockPrismaSession.findUnique as jest.Mock).mockResolvedValue({
      id: 'session-1',
      refreshToken: 'old-token',
      expiresAt: pastDate,
      user: buildDbUser(),
    })

    await expect(userSa.refreshToken('old-token')).rejects.toMatchObject({ statusCode: 401 })
  })

  it('lève ApiError 401 si le refresh token est introuvable', async () => {
    ;(mockPrismaSession.findUnique as jest.Mock).mockResolvedValue(null)

    await expect(userSa.refreshToken('token-inexistant')).rejects.toMatchObject({ statusCode: 401 })
  })
})

// ─────────────────────────────────────────────────────────────────────────────
describe('logOut', () => {
  it('retourne success:true pour un refresh token valide', async () => {
    ;(mockPrismaSession.delete as jest.Mock).mockResolvedValue({})

    const result = await userSa.logOut('valid-refresh')

    expect(result.success).toBe(true)
    expect(mockPrismaSession.delete).toHaveBeenCalledWith({ where: { refreshToken: 'valid-refresh' } })
  })
})
