/**
 * Controller TSOA — Analytics / Tempo.
 *
 * Expose un endpoint GET /analytics/project/:projectId qui retourne
 * les métriques de suivi temporel d'un projet (vélocité, répartitions,
 * sprint actif, charge membres, activité hebdomadaire).
 *
 * Protégé par authMiddleware (Bearer JWT).
 */

import { Controller, Get, Middlewares, Path, Route, Security, Tags } from "tsoa";
import { authMiddleware } from "../middleware/auth.middleware";
import analyticsSa from "../../service/applicative/analytics.sa";

@Route("analytics")
@Tags("analytics")
@Middlewares([authMiddleware])
export class AnalyticsController extends Controller {
  /**
   * Récupère les métriques Tempo d'un projet.
   *
   * Retourne : vélocité par sprint, répartitions par type/priorité,
   * progression du sprint actif, charge par membre et activité hebdomadaire.
   *
   * @param projectId - Identifiant du projet.
   * @returns ProjectAnalyticsDTO encapsulé dans { success, data }.
   * @throws ApiError(404) si le projet est introuvable.
   */
  @Get("project/{projectId}")
  @Security("bearer")
  public async getProjectAnalytics(@Path() projectId: string) {
    return analyticsSa.getProjectAnalytics(projectId);
  }
}
