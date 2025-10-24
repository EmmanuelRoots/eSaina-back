import { Body, Controller, Get, Middlewares, Post, Query, Route, Tags, Request, Delete } from "tsoa";
import { Request as ExpressRequest} from 'express'

import { authMiddleware } from "../middleware/auth.middleware";
import postSa from "../../service/applicative/post.sa";

@Route('post')
@Tags('post')
@Middlewares([authMiddleware])
export class PostController extends Controller {

  @Get('get-salon-post')
  public async getSalonPost(@Query() salonId:string, @Query() page = 1, @Query() limit = 20){
    return postSa.getPostSalon(salonId, page, limit)
  }

  @Post('create-post')
  public async createPost(@Body()body:any){

    return postSa.createPost(body)
  }

  @Post('add-reaction')
  public async addReaction(@Request() req : ExpressRequest){
    
    return postSa.createReaction(req.body, (req as any).user.id)
  }

  @Delete('delete-reaction')
  public async deleteReaction(@Query() reactionId : string){

    return postSa.deleteReaction(reactionId)
  }

  @Post('create-comment')
  public async createComment(@Request() req : ExpressRequest){
    
    return postSa.createComment(req.body, (req as any).user.id)
  }

  @Get('get-comments')
  public async getComments(@Query() postId: string){

    return postSa.getComments(postId)
  }
}
