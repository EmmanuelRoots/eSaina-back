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
  TeamAddMembersDTO,
  TeamAddProjectsDTO,
  TeamCreateDTO,
  TeamListResponseDTO,
  TeamUpdateDTO,
  TeamUpdateMemberRoleDTO,
} from '../../data/dto/team.dto'
import teamSA from '../../service/applicative/team.sa'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleMiddleware } from '../middleware/role.middleware'

/**
 * Console d'administration des équipes (Teams).
 * Liste / création / suppression / mise à jour : SUPER_ADMIN + ADMIN.
 * Gestion des membres et des projets liés : SUPER_ADMIN, ADMIN, ou LEAD de l'équipe
 * (vérifié à l'intérieur des handlers correspondants).
 */
@Route('admin/teams')
@Tags('admin-teams')
@Middlewares([authMiddleware])
export class AdminTeamController extends Controller {
  /**
   * Liste paginée des équipes avec recherche optionnelle.
   */
  @Get()
  @Middlewares([roleMiddleware(['SUPER_ADMIN', 'ADMIN'])])
  public async listTeams(
    @Query() page = 1,
    @Query() limit = 20,
    @Query() search?: string
  ): Promise<TeamListResponseDTO> {
    return teamSA.listTeams({ page, pageSize: limit, search })
  }

  /**
   * Recherche les projets disponibles pour rattachement à une équipe.
   * Réservé SUPER_ADMIN / ADMIN.
   */
  @Get('available-projects')
  @Middlewares([roleMiddleware(['SUPER_ADMIN', 'ADMIN'])])
  public async searchProjects(
    @Query() search?: string,
    @Query() limit = 20
  ) {
    return { success: true, data: await teamSA.searchProjects({ search, limit }) }
  }

  /**
   * Détail d'une équipe incluant ses membres et projets liés.
   */
  @Get('{id}')
  public async getTeam(
    @Request() req: ExpressRequest,
    @Path() id: string
  ) {
    const actor = (req as any).user
    await teamSA.assertCanManageTeam(id, actor)
    return { success: true, data: await teamSA.getTeam(id) }
  }

  /**
   * Crée une équipe. Le créateur devient automatiquement LEAD.
   */
  @Post()
  @Middlewares([roleMiddleware(['SUPER_ADMIN', 'ADMIN'])])
  public async createTeam(
    @Request() req: ExpressRequest,
    @Body() body: TeamCreateDTO
  ) {
    const actor = (req as any).user
    return teamSA.createTeam(body, { id: actor?.id })
  }

  /**
   * Met à jour le nom et/ou la description d'une équipe.
   */
  @Patch('{id}')
  @Middlewares([roleMiddleware(['SUPER_ADMIN', 'ADMIN'])])
  public async updateTeam(
    @Path() id: string,
    @Body() body: TeamUpdateDTO
  ) {
    return teamSA.updateTeam(id, body)
  }

  /**
   * Supprime une équipe (cascade sur membres et liaisons projets).
   */
  @Delete('{id}')
  @Middlewares([roleMiddleware(['SUPER_ADMIN', 'ADMIN'])])
  public async deleteTeam(@Path() id: string) {
    return teamSA.deleteTeam(id)
  }

  /**
   * Ajoute un ou plusieurs membres à l'équipe (rôle MEMBER par défaut).
   * Autorisé pour SUPER_ADMIN, ADMIN, ou LEAD de l'équipe.
   */
  @Post('{id}/members')
  public async addMembers(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: TeamAddMembersDTO
  ) {
    const actor = (req as any).user
    await teamSA.assertCanManageTeam(id, actor)
    return teamSA.addMembers(id, body)
  }

  /**
   * Retire un membre de l'équipe. Refuse si c'est le dernier LEAD.
   */
  @Delete('{id}/members/{userId}')
  public async removeMember(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Path() userId: string
  ) {
    const actor = (req as any).user
    await teamSA.assertCanManageTeam(id, actor)
    return teamSA.removeMember(id, userId)
  }

  /**
   * Change le rôle (LEAD/MEMBER) d'un membre.
   */
  @Patch('{id}/members/{userId}')
  public async updateMemberRole(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Path() userId: string,
    @Body() body: TeamUpdateMemberRoleDTO
  ) {
    const actor = (req as any).user
    await teamSA.assertCanManageTeam(id, actor)
    return teamSA.updateMemberRole(id, userId, body.role)
  }

  /**
   * Rattache un ou plusieurs projets à l'équipe.
   */
  @Post('{id}/projects')
  public async addProjects(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Body() body: TeamAddProjectsDTO
  ) {
    const actor = (req as any).user
    await teamSA.assertCanManageTeam(id, actor)
    return teamSA.addProjects(id, body)
  }

  /**
   * Détache un projet de l'équipe.
   */
  @Delete('{id}/projects/{projectId}')
  public async removeProject(
    @Request() req: ExpressRequest,
    @Path() id: string,
    @Path() projectId: string
  ) {
    const actor = (req as any).user
    await teamSA.assertCanManageTeam(id, actor)
    return teamSA.removeProject(id, projectId)
  }
}
