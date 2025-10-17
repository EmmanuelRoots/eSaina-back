import { Controller, Get, Middlewares, Query, Route, Tags } from "tsoa";
import { authMiddleware } from "../middleware/auth.middleware";
import postSa from "../../service/applicative/post.sa";

@Route('post')
@Tags('post')
export class PostController extends Controller {

  @Get('get-salon-post')
  @Middlewares([authMiddleware])
  public async getSalonPost(@Query() salonId:string){
    return postSa.getPostSalon(salonId)
  }
}