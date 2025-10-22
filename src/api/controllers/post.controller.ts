import { Body, Controller, Get, Middlewares, Post, Query, Route, Tags, Request } from "tsoa";
import { Request as ExpressRequest} from 'express'

import { authMiddleware } from "../middleware/auth.middleware";
import postSa from "../../service/applicative/post.sa";

@Route('post')
@Tags('post')
export class PostController extends Controller {

  @Get('get-salon-post')
  @Middlewares([authMiddleware])
  public async getSalonPost(@Query() salonId:string, @Query() page = 1, @Query() limit = 20){
    return postSa.getPostSalon(salonId, page, limit)
  }

  @Post('create-post')
  @Middlewares([authMiddleware])
  public async createPost(@Body()body:any){

    return postSa.createPost(body)
  }

  @Post('add-reaction')
  @Middlewares([authMiddleware])
  public async addReaction(@Request() req : ExpressRequest){
    
    return postSa.createReaction(req.body, (req as any).user.id)
  }
}