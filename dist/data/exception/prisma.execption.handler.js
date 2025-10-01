"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaExceptionHandler = void 0;
const library_1 = require("@prisma/client/runtime/library");
/**
 * Classe utilitaire pour gérer les erreurs spécifiques à Prisma.
 * Permet de traduire les codes d'erreur Prisma en actions métier ou messages clairs.
 */
class PrismaExceptionHandler {
    /**
     * Analyse une erreur Prisma et renvoie une information structurée.
     * @param error - L'erreur levée par Prisma
     * @returns Un objet décrivant le type d'erreur et les champs concernés (si applicable)
     */
    static handle(error) {
        if (error && typeof error === 'object' && 'code' in error && typeof error.code === 'string' && 'meta' in error && 'clientVersion' in error) {
            switch (error.code) {
                case 'P2002': // Unique constraint failed
                    const fields = error.meta?.target ?? [];
                    return {
                        type: 'UNIQUE_CONSTRAINT_VIOLATION',
                        message: `Une ressource avec ces valeurs uniques existe déjà.`,
                        fields: Array.isArray(fields) ? fields : [fields],
                        originalError: error,
                    };
                case 'P2025': // Record to update not found
                    return {
                        type: 'RECORD_NOT_FOUND',
                        message: `L'enregistrement demandé est introuvable.`,
                        originalError: error,
                    };
                case 'P2003': // Foreign key constraint failed
                    return {
                        type: 'FOREIGN_KEY_CONSTRAINT_VIOLATION',
                        message: `Impossible de supprimer ou modifier : une dépendance existe.`,
                        originalError: error,
                    };
                case 'P2000': // Value too long for column
                    return {
                        type: 'VALUE_TOO_LONG',
                        message: `Une valeur dépasse la limite autorisée.`,
                        originalError: error,
                    };
                default:
                    return {
                        type: 'UNKNOWN_PRISMA_ERROR',
                        message: `Erreur Prisma non gérée : ${error.code}`,
                        originalError: error,
                    };
            }
        }
        // Ce n'est pas une erreur Prisma connue → on la laisse passer ou on la loggue
        return {
            type: 'NOT_PRISMA_ERROR',
            message: 'Erreur non liée à Prisma',
            originalError: error,
        };
    }
    /**
     * Vérifie si l'erreur est une violation d'unicité (P2002).
     */
    static isUniqueConstraintViolation(error) {
        return (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === 'P2002');
    }
    /**
     * Vérifie si l'erreur est "Record not found" (P2025).
     */
    static isRecordNotFound(error) {
        return (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === 'P2025');
    }
}
exports.PrismaExceptionHandler = PrismaExceptionHandler;
