import { Body, Controller, Get, Middlewares, Query, Request, Response, Route, Security, Tags } from "tsoa";
import { Request as ExpressRequest} from 'express'
import { authMiddleware } from "../middleware/auth.middleware";
import conversationSa from "../../service/applicative/conversation.sa";
import { UserDTO } from "../../data/dto/user.dto";

@Route('conversation')
@Tags('conversation')
export class ConversationController extends Controller {

  @Get('all-conversation')
  @Middlewares([authMiddleware])
  @Response(200, 'success')
  @Security('bearer') 
  public async getAllConversationByUser(@Request() req : ExpressRequest,@Query() page = 1, @Query() limit = 20 ) {
    
    return conversationSa.getAllConversationByUser(req.body.uuid, Number(page), Number(limit))
  }
}