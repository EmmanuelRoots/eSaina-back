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
  Route,
  Tags,
} from "tsoa";

import { authMiddleware } from "../middleware/auth.middleware";
import sprintSa from "../../service/applicative/sprint.sa";
import {
  CreateSprintRequestDTO,
  UpdateSprintRequestDTO,
} from "../../data/dto/sprint.dto";

@Route("sprint")
@Tags("sprint")
@Middlewares([authMiddleware])
export class SprintController extends Controller {
  @Post("create")
  public async create(@Body() body: CreateSprintRequestDTO) {
    return sprintSa.createSprint(body);
  }

  @Get("list")
  public async list(@Query() projectId: string) {
    return sprintSa.listSprints(projectId);
  }

  @Patch("{sprintId}")
  public async update(
    @Path() sprintId: string,
    @Body() body: UpdateSprintRequestDTO,
  ) {
    return sprintSa.updateSprint(sprintId, body);
  }

  @Post("{sprintId}/start")
  public async start(@Path() sprintId: string) {
    return sprintSa.startSprint(sprintId);
  }

  @Post("{sprintId}/close")
  public async close(@Path() sprintId: string) {
    return sprintSa.closeSprint(sprintId);
  }

  @Delete("{sprintId}")
  public async remove(@Path() sprintId: string) {
    return sprintSa.deleteSprint(sprintId);
  }
}
