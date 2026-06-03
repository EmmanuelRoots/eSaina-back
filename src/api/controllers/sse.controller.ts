/**
 * Controller TSOA pour la gestion des notifications SSE et de leur état de lecture.
 *
 * Rôle : expose les endpoints REST liés aux notifications persistées.
 * Le stream SSE lui-même est enregistré hors TSOA dans app.ts (contrainte EventSource).
 *
 * Dépendances : sseSa (sse.sa.ts) pour la logique métier.
 */
import { Body, Controller, Get, Middlewares, Patch, Path, Post, Query, Route, Tags } from 'tsoa'

import { NotificationDTO, StoredNotificationDTO } from '../../data/dto/notification.dto'
import { authMiddleware } from '../middleware/auth.middleware'
import sseSa from '../../service/applicative/sse.sa'

@Route('notification')
@Tags('notification')
export class SSEController extends Controller {
  /**
   * Envoie manuellement une notification SSE à un utilisateur.
   * Endpoint utilitaire (tests, admin).
   */
  @Post('send')
  @Middlewares([authMiddleware])
  public async sendNotification(@Body() body: NotificationDTO) {
    return sseSa.sendEventToUser({ ...body })
  }

  /**
   * Récupère les N dernières notifications de l'utilisateur authentifié.
   *
   * @param userId - Identifiant de l'utilisateur.
   * @param limit  - Nombre maximum de notifications à retourner (défaut : 20).
   */
  @Get()
  @Middlewares([authMiddleware])
  public async getNotifications(
    @Query() userId: string,
    @Query() limit: number = 20,
  ): Promise<{ success: boolean; data: StoredNotificationDTO[] }> {
    return sseSa.getUserNotifications(userId, limit)
  }

  /**
   * Marque une notification spécifique comme lue.
   * Vérifie que la notification appartient à l'utilisateur authentifié.
   *
   * @param notificationId - Identifiant de la notification à marquer.
   * @param userId         - Identifiant de l'utilisateur (ownership check).
   */
  @Patch('{notificationId}/read')
  @Middlewares([authMiddleware])
  public async markAsRead(
    @Path() notificationId: string,
    @Query() userId: string,
  ): Promise<{ success: boolean; data: StoredNotificationDTO }> {
    return sseSa.markAsRead(notificationId, userId)
  }

  /**
   * Marque toutes les notifications non lues de l'utilisateur comme lues.
   *
   * @param userId - Identifiant de l'utilisateur.
   */
  @Patch('read-all')
  @Middlewares([authMiddleware])
  public async markAllAsRead(
    @Query() userId: string,
  ): Promise<{ success: boolean; data: { count: number } }> {
    return sseSa.markAllAsRead(userId)
  }
}
