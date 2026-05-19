import {
  Body,
  Controller,
  Delete,
  Get,
  Middlewares,
  Path,
  Post,
  Query,
  Route,
  Tags,
} from "tsoa";

import { authMiddleware } from "../middleware/auth.middleware";
import labelSa from "../../service/applicative/label.sa";
import { CreateLabelRequestDTO } from "../../data/dto/label.dto";

@Route("label")
@Tags("label")
@Middlewares([authMiddleware])
export class LabelController extends Controller {
  @Post("create")
  public async create(@Body() body: CreateLabelRequestDTO) {
    return labelSa.createLabel(body);
  }

  @Get("list")
  public async list(@Query() projectId: string) {
    return labelSa.listLabels(projectId);
  }

  @Delete("{labelId}")
  public async remove(@Path() labelId: string) {
    return labelSa.deleteLabel(labelId);
  }
}
