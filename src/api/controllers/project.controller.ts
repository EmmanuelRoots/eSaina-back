import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Patch,
  Path,
  Post,
  Request,
  Route,
  Tags,
} from "tsoa";
import { Request as ExpressRequest } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import projectSa from "../../service/applicative/project.sa";
import {
  AddProjectMemberRequestDTO,
  CreateProjectRequestDTO,
  UpdateProjectRequestDTO,
} from "../../data/dto/project.dto";

@Route("project")
@Tags("project")
@Middlewares([authMiddleware])
export class ProjectController extends Controller {
  @Post("create")
  public async create(
    @Body() body: CreateProjectRequestDTO,
    @Request() req: ExpressRequest,
  ) {
    return projectSa.createProject(body, (req as any).user.id);
  }

  @Get("mine")
  public async listMine(@Request() req: ExpressRequest) {
    return projectSa.getProjectsForUser((req as any).user.id);
  }

  @Get("{projectId}")
  public async getById(@Path() projectId: string) {
    return projectSa.getProjectById(projectId);
  }

  @Patch("{projectId}")
  public async update(
    @Path() projectId: string,
    @Body() body: UpdateProjectRequestDTO,
  ) {
    return projectSa.updateProject(projectId, body);
  }

  @Delete("{projectId}")
  public async remove(@Path() projectId: string) {
    return projectSa.deleteProject(projectId);
  }

  @Get("{projectId}/board")
  public async getBoard(@Path() projectId: string) {
    return projectSa.getBoard(projectId);
  }

  @Get("{projectId}/backlog")
  public async getBacklog(@Path() projectId: string) {
    return projectSa.getBacklog(projectId);
  }

  @Post("{projectId}/members")
  public async addMember(
    @Path() projectId: string,
    @Body() body: AddProjectMemberRequestDTO,
  ) {
    return projectSa.addMember(projectId, body);
  }

  @Delete("{projectId}/members/{userId}")
  public async removeMember(
    @Path() projectId: string,
    @Path() userId: string,
  ) {
    return projectSa.removeMember(projectId, userId);
  }
}
