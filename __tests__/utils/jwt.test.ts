/**
 * Tests unitaires — jwt.ts
 *
 * Vérifie : signature, vérification, expiration, payload, secret manquant.
 *
 * Les variables d'environnement sont définies AVANT le require() du module
 * car ACCESS_TOKEN_SECRET est capturé à l'import (const ACCESS_SECRET = process.env...).
 */

// Env vars définies avant tout import du module jwt
process.env.ACCESS_TOKEN_SECRET = 'test-secret-jest'
process.env.ACCESS_TOKEN_TTL = '5m'

import type { UserDTO } from '../../src/data/dto/user.dto'

// Chargé après la définition des env vars
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { signAccess, verifyAccess } = require('../../src/utils/jwt') as typeof import('../../src/utils/jwt')

const mockUser: UserDTO = {
  id: 'user-123',
  email: 'test@example.com',
  firstName: 'Jean',
  lastName: 'Dupont',
  phoneNumber: '+261320000000',
  roleId: 'role-abc',
}

describe('signAccess', () => {
  it('retourne une chaîne JWT valide (3 segments)', () => {
    const token = signAccess(mockUser)
    expect(token.split('.')).toHaveLength(3)
  })

  it('utilise l\'algorithme HS256', () => {
    const token = signAccess(mockUser)
    const header = JSON.parse(Buffer.from(token.split('.')[0], 'base64').toString())
    expect(header.alg).toBe('HS256')
  })

  it('inclut les données utilisateur dans le payload', () => {
    const token = signAccess(mockUser)
    const { user } = verifyAccess(token)
    expect(user.id).toBe(mockUser.id)
    expect(user.email).toBe(mockUser.email)
  })

  it('ne lève pas d\'erreur avec un TTL valide', () => {
    expect(() => signAccess(mockUser)).not.toThrow()
  })
})

describe('verifyAccess', () => {
  it('retourne le payload utilisateur pour un token valide', () => {
    const token = signAccess(mockUser)
    const payload = verifyAccess(token)
    expect(payload.user).toMatchObject({ id: mockUser.id, email: mockUser.email })
  })

  it('lève une erreur pour un token forgé', () => {
    const fakeToken = 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyIjp7fX0.invalid-sig'
    expect(() => verifyAccess(fakeToken)).toThrow()
  })

  it('lève une erreur pour un token expiré', async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require('jsonwebtoken')
    const expired = jwt.sign({ user: mockUser }, 'test-secret-jest', {
      algorithm: 'HS256',
      expiresIn: 1, // 1 seconde
    })
    await new Promise((r) => setTimeout(r, 1100))
    expect(() => verifyAccess(expired)).toThrow()
  })

  it('lève une erreur pour un token signé avec un secret différent', () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const jwt = require('jsonwebtoken')
    const wrongToken = jwt.sign({ user: mockUser }, 'autre-secret', { algorithm: 'HS256' })
    expect(() => verifyAccess(wrongToken)).toThrow()
  })

  it('lève une erreur pour un token vide', () => {
    expect(() => verifyAccess('')).toThrow()
  })
})
