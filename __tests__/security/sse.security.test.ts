/**
 * Tests de sécurité — Endpoint SSE `/notification/stream`
 *
 * Vérifie que l'endpoint SSE rejette les requêtes sans token, avec un token
 * invalide ou avec un token ne correspondant pas à l'userId demandé.
 */
import express from 'express'
import request from 'supertest'

// Mocks avant import de app pour éviter les dépendances externes
jest.mock('../../src/api/routes/routes', () => ({ RegisterRoutes: jest.fn() }))
jest.mock('../../src/repository', () => ({
  prisma: {
    user: { update: jest.fn() },
  },
}))
jest.mock('../../src/service/applicative/sse.sa', () => ({
  default: {
    addClient: jest.fn(() => 'client-1'),
    removeClient: jest.fn(),
  },
}))

// On stub verifyAccess pour contrôler ce qu'il retourne
jest.mock('../../src/utils/jwt', () => ({
  verifyAccess: jest.fn(),
}))

import * as jwtUtils from '../../src/utils/jwt'
const mockVerify = jwtUtils.verifyAccess as jest.MockedFunction<typeof jwtUtils.verifyAccess>

// Swagger JSON mocké car app.ts le lit au démarrage
jest.mock('fs', () => {
  const real = jest.requireActual('fs')
  return {
    ...real,
    readFileSync: (p: string, enc: string) => {
      if (String(p).includes('swagger.json')) return JSON.stringify({ openapi: '3.0.0' })
      return real.readFileSync(p, enc)
    },
  }
})

let appInstance: ReturnType<typeof express>

beforeAll(async () => {
  const { app } = await import('../../src/app')
  appInstance = app
})

afterEach(() => jest.clearAllMocks())

describe('GET /notification/stream — sécurité', () => {
  it('renvoie 400 si userId est absent', async () => {
    const res = await request(appInstance).get('/notification/stream?token=tok')
    expect(res.status).toBe(400)
  })

  it('renvoie 400 si token est absent', async () => {
    const res = await request(appInstance).get('/notification/stream?userId=u1')
    expect(res.status).toBe(400)
  })

  it('renvoie 401 si le token JWT est invalide', async () => {
    mockVerify.mockImplementation(() => { throw new Error('Invalid') })
    const res = await request(appInstance).get('/notification/stream?userId=u1&token=bad')
    expect(res.status).toBe(401)
  })

  it('renvoie 403 si le token JWT appartient à un autre utilisateur', async () => {
    mockVerify.mockReturnValue({ user: { id: 'other-user' } } as any)
    const res = await request(appInstance).get('/notification/stream?userId=u1&token=tok')
    expect(res.status).toBe(403)
  })
})
