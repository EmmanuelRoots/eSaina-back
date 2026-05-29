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
} from "tsoa";
import { Request as ExpressRequest } from "express";

import { authMiddleware } from "../middleware/auth.middleware";
import issueSa from "../../service/applicative/issue.sa";
import {
  CreateIssueCommentRequestDTO,
  CreateIssueRequestDTO,
  IssueStatus,
  IssueType,
  UpdateIssueRequestDTO,
} from "../../data/dto/issue.dto";

@Route("issue")
@Tags("issue")
@Middlewares([authMiddleware])
export class IssueController extends Controller {
  @Post("create")
  public async create(
    @Body() body: CreateIssueRequestDTO,
    @Request() req: ExpressRequest,
  ) {
    return issueSa.createIssue(body, (req as any).user.id);
  }

  @Get("list")
  public async list(
    @Query() projectId: string,
    @Query() sprintId?: string,
    @Query() assigneeId?: string,
    @Query() status?: IssueStatus,
    @Query() statusId?: string,
    @Query() type?: IssueType,
  ) {
    return issueSa.listIssues(projectId, { sprintId, assigneeId, status, statusId, type });
  }

  @Get("{issueId}")
  public async getById(@Path() issueId: string) {
    return issueSa.getIssueById(issueId);
  }

  @Patch("{issueId}")
  public async update(
    @Path() issueId: string,
    @Body() body: UpdateIssueRequestDTO,
    @Request() req: ExpressRequest,
  ) {
    return issueSa.updateIssue(issueId, body, (req as any).user.id);
  }

  @Delete("{issueId}")
  public async remove(@Path() issueId: string) {
    return issueSa.deleteIssue(issueId);
  }

  @Post("comment")
  public async addComment(
    @Body() body: CreateIssueCommentRequestDTO,
    @Request() req: ExpressRequest,
  ) {
    return issueSa.addComment(body, (req as any).user.id);
  }

  @Get("{issueId}/comments")
  public async listComments(@Path() issueId: string) {
    return issueSa.listComments(issueId);
  }
}
