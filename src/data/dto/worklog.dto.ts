/**
 * DTOs pour la fonctionnalité de saisie des tempos (WorkLog).
 *
 * Un WorkLog représente une saisie de temps passé par un utilisateur
 * sur une issue donnée, à l'image de la fonctionnalité Tempo de JIRA.
 */

import { UserDTO } from "./user.dto";

/** Projection d'un WorkLog exposée à l'API. */
export interface WorkLogDTO {
  id: string;
  issueId: string;
  /** Clé lisible de l'issue (ex. "PRJ-42"), incluse pour l'affichage feuille de temps. */
  issueKey?: string;
  issueTitle?: string;
  userId: string;
  user: Pick<UserDTO, "id" | "firstName" | "lastName" | "pdpUrl">;
  /** Jour du pointage au format ISO 8601 (date uniquement, heure = minuit UTC). */
  date: string;
  timeSpentMinutes: number;
  description?: string | null;
  createdAt: string;
  updatedAt: string;
}

/** Payload de création d'un WorkLog. */
export interface CreateWorkLogDTO {
  issueId: string;
  /** Jour du pointage au format ISO 8601 (ex. "2026-05-29"). */
  date: string;
  /** Durée en minutes (doit être > 0). */
  timeSpentMinutes: number;
  description?: string;
}

/** Payload de mise à jour partielle d'un WorkLog (ownership requis). */
export interface UpdateWorkLogDTO {
  date?: string;
  timeSpentMinutes?: number;
  description?: string | null;
}

/** Filtres pour la vue feuille de temps par projet. */
export interface WorkLogProjectFiltersDTO {
  /** Restreindre à un utilisateur spécifique. */
  userId?: string;
  /** Borne inférieure (date ISO, incluse). */
  from?: string;
  /** Borne supérieure (date ISO, incluse). */
  to?: string;
}
