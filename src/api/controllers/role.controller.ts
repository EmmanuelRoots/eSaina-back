import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Put,
  Route,
  Tags,
} from 'tsoa'
import { RoleDTO } from '../../data/dto/role.dto'
import roleSA from '../../service/applicative/role.sa'
import { authMiddleware } from '../middleware/auth.middleware'
import { roleMiddleware } from '../middleware/role.middleware'

@Route('roles')
@Tags('roles')
@Middlewares([authMiddleware, roleMiddleware(['SUPER_ADMIN'])])
export class RoleController extends Controller {
  /**
   * Récupère tous les rôles.
   */
  @Get()
  public async getAllRoles() {
    return roleSA.findAll()
  }

  /**
   * Récupère dynamiquement la liste des tables (modèles Prisma) disponibles
   * pour la définition des autorisations.
   */
  @Get('tables')
  public async getTables() {
    return roleSA.listTables()
  }

  /**
   * Crée un nouveau rôle.
   */
  @Post()
  public async createRole(@Body() body: RoleDTO) {
    return roleSA.create(body)
  }

  /**
   * Met à jour un rôle existant.
   */
  @Put('{id}')
  public async updateRole(@Path() id: string, @Body() body: RoleDTO) {
    return roleSA.update(id, body)
  }

  /**
   * Supprime un rôle.
   */
  @Delete('{id}')
  public async deleteRole(@Path() id: string) {
    return roleSA.deleteRole(id)
  }
}
