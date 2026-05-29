/**
 * Controller TSOA — endpoints de saisie des tempos (WorkLog).
 *
 * Place dans le flux : RegisterRoutes → WorkLogController → worklog.sa.
 *
 * Tous les endpoints sont protégés par authMiddleware + @Security('bearer').
 * L'id de l'utilisateur connecté est lu depuis req.user (injecté par authMiddleware).
 */

import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Query,
  Request,
  Route,
  Security,
  Tags,
} from "tsoa";
import { Request as ExpressRequest } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import worklogSa from "../../service/applicative/worklog.sa";
import {
  CreateWorkLogDTO,
  UpdateWorkLogDTO,
} from "../../data/dto/worklog.dto";

@Route("worklog")
@Tags("worklog")
@Middlewares([authMiddleware])
@Security("bearer")
export class WorkLogController extends Controller {
  /**
   * Crée un nouveau pointage de temps sur une issue.
   *
   * @param body - Données du pointage (issueId, date, durée, description).
   * @returns Le WorkLogDTO créé.
   * @throws ApiError(400) si la durée est invalide.
   * @throws ApiError(404) si l'issue n'existe pas.
   */
  @Post("create")
  public async create(
    @Body() body: CreateWorkLogDTO,
    @Request() req: ExpressRequest,
  ) {
    return worklogSa.createWorkLog(body, (req as any).user.id);
  }

  /**
   * Retourne tous les pointages d'une issue, triés par date décroissante.
   *
   * @param issueId - Id de l'issue.
   */
  @Get("issue/{issueId}")
  public async listByIssue(@Path() issueId: string) {
    return worklogSa.getWorkLogsByIssue(issueId);
  }

  /**
   * Retourne les pointages d'un projet pour la feuille de temps.
   * Utilisé par la page Tempo pour construire la vue hebdomadaire.
   *
   * @param projectId - Id du projet.
   * @param userId    - Filtrer par utilisateur (optionnel).
   * @param from      - Borne inférieure ISO (optionnel, ex. "2026-05-26").
   * @param to        - Borne supérieure ISO (optionnel, ex. "2026-06-01").
   */
  @Get("project/{projectId}")
  public async listByProject(
    @Path() projectId: string,
    @Query() userId?: string,
    @Query() from?: string,
    @Query() to?: string,
  ) {
    return worklogSa.getWorkLogsByProject(projectId, { userId, from, to });
  }

  /**
   * Met à jour un pointage existant (ownership requis).
   *
   * @param worklogId - Id du WorkLog.
   * @param body      - Champs à modifier.
   * @throws ApiError(403) si l'utilisateur n'est pas l'auteur.
   */
  @Patch("{worklogId}")
  public async update(
    @Path() worklogId: string,
    @Body() body: UpdateWorkLogDTO,
    @Request() req: ExpressRequest,
  ) {
    return worklogSa.updateWorkLog(worklogId, body, (req as any).user.id);
  }

  /**
   * Supprime un pointage (ownership requis).
   *
   * @param worklogId - Id du WorkLog.
   * @throws ApiError(403) si l'utilisateur n'est pas l'auteur.
   */
  @Delete("{worklogId}")
  public async remove(
    @Path() worklogId: string,
    @Request() req: ExpressRequest,
  ) {
    return worklogSa.deleteWorkLog(worklogId, (req as any).user.id);
  }
}
