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
  GroupAddMembersDTO,
  GroupCreateDTO,
  GroupListResponseDTO,
  GroupUpdateDTO,
  GroupUpdateMemberRoleDTO,
} from '../../data/dto/group.dto'
import groupSA from '../../service/applicative/group.sa'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleMiddleware } from '../middleware/role.middleware'

/**
 * Console d'administration des groupes.
 * Réservée aux rôles SUPER_ADMIN et ADMIN.
 */
@Route('admin/groups')
@Tags('admin-groups')
@Middlewares([authMiddleware, roleMiddleware(['SUPER_ADMIN', 'ADMIN'])])
export class AdminGroupController extends Controller {
  /**
   * Liste paginée des groupes avec recherche optionnelle.
   */
  @Get()
  public async listGroups(
    @Query() page = 1,
    @Query() limit = 20,
    @Query() search?: string
  ): Promise<GroupListResponseDTO> {
    return groupSA.listGroups({ page, pageSize: limit, search })
  }

  /**
   * Détail d'un groupe incluant la liste de ses membres.
   */
  @Get('{id}')
  public async getGroup(@Path() id: string) {
    return { success: true, data: await groupSA.getGroup(id) }
  }

  /**
   * Crée un groupe. Le créateur devient automatiquement OWNER.
   */
  @Post()
  public async createGroup(
    @Request() req: ExpressRequest,
    @Body() body: GroupCreateDTO
  ) {
    const actor = (req as any).user
    return groupSA.createGroup(body, { id: actor?.id })
  }

  /**
   * Met à jour le nom et/ou la description d'un groupe.
   */
  @Patch('{id}')
  public async updateGroup(
    @Path() id: string,
    @Body() body: GroupUpdateDTO
  ) {
    return groupSA.updateGroup(id, body)
  }

  /**
   * Supprime un groupe et tous ses membres (cascade).
   */
  @Delete('{id}')
  public async deleteGroup(@Path() id: string) {
    return groupSA.deleteGroup(id)
  }

  /**
   * Ajoute un ou plusieurs membres (rôle MEMBER) au groupe.
   */
  @Post('{id}/members')
  public async addMembers(
    @Path() id: string,
    @Body() body: GroupAddMembersDTO
  ) {
    return groupSA.addMembers(id, body)
  }

  /**
   * Retire un membre du groupe. Refuse si c'est le dernier OWNER.
   */
  @Delete('{id}/members/{userId}')
  public async removeMember(
    @Path() id: string,
    @Path() userId: string
  ) {
    return groupSA.removeMember(id, userId)
  }

  /**
   * Change le rôle (OWNER/MEMBER) d'un membre.
   */
  @Patch('{id}/members/{userId}')
  public async updateMemberRole(
    @Path() id: string,
    @Path() userId: string,
    @Body() body: GroupUpdateMemberRoleDTO
  ) {
    return groupSA.updateMemberRole(id, userId, body.role)
  }
}
