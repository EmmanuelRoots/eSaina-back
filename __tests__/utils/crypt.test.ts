/**
 * Tests unitaires — crypt.ts.ts
 *
 * Vérifie : hachage bcrypt, comparaison, migration SHA-256, détection legacy.
 */
import { compareText, hashText, isLegacyHash } from '../../src/service/technical/crypt.ts'
import { createHash } from 'crypto'

describe('hashText', () => {
  it('retourne un hash bcrypt (commence par $2)', async () => {
    const hash = await hashText('monMotDePasse')
    expect(hash).toMatch(/^\$2/)
  })

  it('deux appels produisent des hashes différents (sel aléatoire)', async () => {
    const h1 = await hashText('monMotDePasse')
    const h2 = await hashText('monMotDePasse')
    expect(h1).not.toBe(h2)
  })

  it('ne produit plus de SHA-256 (64 hex chars)', async () => {
    const hash = await hashText('monMotDePasse')
    expect(hash).not.toMatch(/^[a-f0-9]{64}$/)
  })
})

describe('compareText', () => {
  it('retourne true pour un hash bcrypt valide', async () => {
    const hash = await hashText('secret')
    await expect(compareText('secret', hash)).resolves.toBe(true)
  })

  it('retourne false pour un mot de passe bcrypt incorrect', async () => {
    const hash = await hashText('secret')
    await expect(compareText('mauvais', hash)).resolves.toBe(false)
  })

  it('accepte les hashes SHA-256 legacy (migration transparente)', async () => {
    const sha256 = createHash('sha256').update(Buffer.from('legacy', 'utf-8')).digest('hex')
    await expect(compareText('legacy', sha256)).resolves.toBe(true)
  })

  it('rejette un mot de passe SHA-256 legacy incorrect', async () => {
    const sha256 = createHash('sha256').update(Buffer.from('legacy', 'utf-8')).digest('hex')
    await expect(compareText('mauvais', sha256)).resolves.toBe(false)
  })
})

describe('isLegacyHash', () => {
  it('détecte un hash SHA-256 comme legacy', () => {
    const sha256 = createHash('sha256').update('test').digest('hex')
    expect(isLegacyHash(sha256)).toBe(true)
  })

  it('ne considère pas un hash bcrypt comme legacy', async () => {
    const bcryptHash = await hashText('test')
    expect(isLegacyHash(bcryptHash)).toBe(false)
  })

  it('traite une chaîne vide comme legacy', () => {
    expect(isLegacyHash('')).toBe(true)
  })
})
