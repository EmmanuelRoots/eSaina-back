/**
 * Tests unitaires — auth.middleware.ts
 *
 * Vérifie : extraction du Bearer token, attachement de req.user,
 * réponses 401 pour les cas invalides.
 */
import { Request, Response, NextFunction } from 'express'
import { authMiddleware } from '../../src/api/middleware/auth.middleware'
import * as jwtUtils from '../../src/utils/jwt'
import type { UserDTO } from '../../src/data/dto/user.dto'

jest.mock('../../src/utils/jwt')
const mockVerifyAccess = jwtUtils.verifyAccess as jest.MockedFunction<typeof jwtUtils.verifyAccess>

const mockUser: UserDTO = {
  id: 'user-1',
  email: 'a@b.com',
  firstName: 'A',
  lastName: 'B',
  phoneNumber: '+261000',
  roleId: 'r1',
}

const buildMocks = (authHeader?: string) => {
  const req = { headers: { authorization: authHeader } } as unknown as Request
  const res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  } as unknown as Response
  const next = jest.fn() as NextFunction
  return { req, res, next }
}

beforeAll(() => {
  process.env.ACCESS_TOKEN_SECRET = 'test-secret'
})

describe('authMiddleware', () => {
  beforeEach(() => jest.clearAllMocks())

  it('appelle next() et attache req.user pour un token valide', () => {
    mockVerifyAccess.mockReturnValue({ user: mockUser })
    const { req, res, next } = buildMocks('Bearer valid-token')

    authMiddleware(req, res, next)

    expect(mockVerifyAccess).toHaveBeenCalledWith('valid-token')
    expect((req as any).user).toEqual(mockUser)
    expect(next).toHaveBeenCalledTimes(1)
  })

  it('renvoie 401 si l\'en-tête Authorization est absent', () => {
    const { req, res, next } = buildMocks(undefined)

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('renvoie 401 si le token est invalide', () => {
    mockVerifyAccess.mockImplementation(() => { throw new Error('Invalid') })
    const { req, res, next } = buildMocks('Bearer bad-token')

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  it('renvoie 401 si le token est expiré', () => {
    mockVerifyAccess.mockImplementation(() => { throw new Error('TokenExpiredError') })
    const { req, res, next } = buildMocks('Bearer expired-token')

    authMiddleware(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
  })
})
