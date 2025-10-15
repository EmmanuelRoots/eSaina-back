import { Body, Controller, Get, Middlewares, Post, Query, Request, Response, Route, Security, Tags } from "tsoa";
import { Request as ExpressRequest} from 'express'
import { authMiddleware } from "../middleware/auth.middleware";
import conversationSa from "../../service/applicative/conversation.sa";
import { UserDTO } from "../../data/dto/user.dto";
import { ConversationDTO } from "../../data/dto/conversation.dto";
import { MessageDTO } from "../../data/dto/message.dto";

@Route('conversation')
@Tags('conversation')
export class ConversationController extends Controller {

  /**
   * get all conversations for user
   * @param req 
   * @param page 
   * @param limit 
   * @returns list of all conversation
   */
  @Get('all-conversation')
  @Middlewares([authMiddleware])
  @Response(200, 'success')
  @Security('bearer') 
  public async getAllConversationByUser(@Request() req : ExpressRequest,@Query() page = 1, @Query() limit = 20 ) {
    
    return conversationSa.getAllConversationByUser((req as any).user.id, Number(page), Number(limit))
  }

  @Post('create')
  @Middlewares([authMiddleware])
  @Security('bearer')
  public async createConversation (@Request() req: ExpressRequest){
    
    return conversationSa.createConversation((req as any).user.id,req.body.conversation)
  }

  @Post('send-message')
  @Middlewares([authMiddleware])
  public async sendMessage(@Request() req: ExpressRequest) {

    return conversationSa.createMessage(req.body)
  }

  @Get('get-all-messages')
  @Middlewares([authMiddleware])
  public async getAllMessagesByConversation (@Query() conversationId:string,@Query() page = 1, @Query() limit = 20 ){

    return conversationSa.getAllMessagesByConversation(conversationId,page,limit)
  }
}