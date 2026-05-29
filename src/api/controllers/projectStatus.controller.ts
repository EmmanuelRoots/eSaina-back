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
} from "tsoa";
import { authMiddleware } from "../middleware/auth.middleware";
import {
  CreateProjectStatusRequestDTO,
  ProjectStatusDTO,
  UpdateProjectStatusRequestDTO,
} from "../../data/dto/project-status.dto";
import projectStatusSa from "../../service/applicative/project-status.sa";

@Route("project")
@Tags("Project Status")
@Middlewares([authMiddleware])
export class ProjectStatusesController extends Controller {
  /**
   * Create a new status for a project
   */
  @Post("{projectId}/statuses")
  public async createStatus(
    @Path() projectId: string,
    @Body() body: CreateProjectStatusRequestDTO
  ): Promise<{ success: boolean; data: ProjectStatusDTO }> {
    return projectStatusSa.createStatus(projectId, body);
  }

  /**
   * List all statuses for a project
   */
  @Get("{projectId}/statuses")
  public async listStatuses(
    @Path() projectId: string
  ): Promise<{ success: boolean; data: ProjectStatusDTO[] }> {
    return projectStatusSa.listStatuses(projectId);
  }

  /**
   * Update a project status
   */
  @Put("statuses/{statusId}")
  public async updateStatus(
    @Path() statusId: string,
    @Body() body: UpdateProjectStatusRequestDTO
  ): Promise<{ success: boolean; data: ProjectStatusDTO }> {
    return projectStatusSa.updateStatus(statusId, body);
  }

  /**
   * Delete a project status
   */
  @Delete("statuses/{statusId}")
  public async deleteStatus(
    @Path() statusId: string
  ): Promise<{ success: boolean; message: string }> {
    return projectStatusSa.deleteStatus(statusId);
  }

  /**
   * Reorder statuses for a project
   */
  @Put("{projectId}/statuses/reorder")
  public async reorderStatuses(
    @Path() projectId: string,
    @Body() body: { statusIds: string[] }
  ): Promise<{ success: boolean; message: string }> {
    return projectStatusSa.reorderStatuses(projectId, body.statusIds);
  }
}
