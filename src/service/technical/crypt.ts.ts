/**
 * Utilitaire de hachage de mots de passe.
 *
 * Utilise bcrypt (coût 12) pour les nouveaux mots de passe.
 * Conserve la détection SHA-256 pour la migration transparente des comptes existants :
 * à la prochaine connexion réussie, le hash legacy est automatiquement mis à jour en bcrypt.
 *
 * @remarks
 * L'ancien hachage SHA-256 sans sel était vulnérable aux attaques par rainbow table.
 * Ne jamais revenir à SHA-256 pour de nouveaux hachages.
 */
import bcrypt from 'bcryptjs'
import { createHash } from 'crypto'

const BCRYPT_ROUNDS = 12

/**
 * Hache un texte avec bcrypt (coût 12).
 * @param text - Texte en clair à hacher.
 * @returns Hash bcrypt.
 */
export const hashText = async (text: string): Promise<string> =>
  bcrypt.hash(text, BCRYPT_ROUNDS)

/**
 * Compare un texte en clair avec un hash stocké.
 * Supporte les deux formats : bcrypt (nouveaux comptes) et SHA-256 legacy.
 *
 * @param plain - Texte en clair saisi par l'utilisateur.
 * @param stored - Hash stocké en base (bcrypt ou SHA-256 hex).
 * @returns `true` si le texte correspond au hash.
 */
export const compareText = async (
  plain: string,
  stored: string
): Promise<boolean> => {
  // Hash bcrypt — commence toujours par "$2a$", "$2b$" ou "$2y$"
  if (stored.startsWith('$2')) {
    return bcrypt.compare(plain, stored)
  }
  // Hash SHA-256 legacy (64 caractères hex)
  const sha256 = createHash('sha256')
    .update(Buffer.from(plain, 'utf-8'))
    .digest('hex')
  return sha256 === stored
}

/**
 * Indique si un hash est au format legacy SHA-256 (migration nécessaire).
 * @param hash - Hash à analyser.
 * @returns `true` si le hash est un SHA-256 hex (non bcrypt).
 */
export const isLegacyHash = (hash: string): boolean => !hash.startsWith('$2')
