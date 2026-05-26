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
  Tags,
} from 'tsoa'
import { Request as ExpressRequest } from 'express'
import {
  AdminUserListResponseDTO,
  AdminUserResetPasswordDTO,
  AdminUserUpdateDTO,
} from '../../data/dto/admin-user.dto'
import adminUserSA from '../../service/applicative/admin-user.sa'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleMiddleware } from '../middleware/role.middleware'

/**
 * Console d'administration des utilisateurs.
 * Réservée aux rôles SUPER_ADMIN et ADMIN.
 */
@Route('admin/users')
@Tags('admin-users')
@Middlewares([authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN'])])
export class AdminUserController extends Controller {
  /**
   * Liste paginée des utilisateurs avec filtres optionnels.
   */
  @Get()
  public async listUsers(
    @Query() page = 1,
    @Query() limit = 20,
    @Query() search?: string,
    @Query() roleId?: string,
    @Query() active?: boolean
  ): Promise<AdminUserListResponseDTO> {
    return adminUserSA.listUsers({
      page,
      pageSize: limit,
      search,
      roleId,
      active,
    })
  }

  /**
   * Met à jour les informations d'un utilisateur (rôle, statut actif, profil).
   */
  @Patch('{id}')
  public async updateUser(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminUserUpdateDTO
  ) {
    const actor = (req as any).user
    return adminUserSA.updateUser(id, body, {
      id: actor?.id,
      roleName: actor?.role?.name,
    })
  }

  /**
   * Réinitialise le mot de passe d'un utilisateur. Toutes ses sessions actives
   * sont révoquées.
   */
  @Post('{id}/reset-password')
  public async resetPassword(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: AdminUserResetPasswordDTO
  ) {
    const actor = (req as any).user
    return adminUserSA.resetPassword(id, body.password, {
      roleName: actor?.role?.name,
    })
  }

  /**
   * Désactive un utilisateur (soft delete via `active = false`).
   */
  @Delete('{id}')
  public async deactivateUser(
    @Request() req: ExpressRequest,
    @Path() id: string
  ) {
    const actor = (req as any).user
    return adminUserSA.deactivateUser(id, {
      id: actor?.id,
      roleName: actor?.role?.name,
    })
  }
}
