import { Body, Controller, Get, Middlewares, Post, Query, RequestProp, Res, Route, Tags, TsoaResponse } from "tsoa";
import {Response as ResponseExpress, Request as RequestExpress} from 'express'

import { NotificationDTO } from "../../data/dto/notification.dto";
import { authMiddleware } from "../middleware/auth.middleware";
import sseSa from "../../service/applicative/sse.sa";

@Route('notification')
@Tags('notification')
export class SSEController extends Controller {

  @Post('send')
  @Middlewares([authMiddleware])
  public async sendNotification(@Body() body: NotificationDTO) {
    return sseSa.sendEventToUser({...body})
  }

  // @Get('stream')
  // public async stream(@Query() userId: string, @RequestProp() req: RequestExpress,@Res() res: ResponseExpress): Promise<void> {
  //   console.log('🔌 SSE connect attempt for user:', userId);

  //   res.setHeader('Content-Type', 'text/event-stream');
  //   res.setHeader('Cache-Control', 'no-cache');
  //   res.setHeader('Connection', 'keep-alive');

  //   const clientId = sseSa.addClient(userId, res);

  //   res.write(`event: connected\ndata: ${JSON.stringify({ userId, clientId })}\n\n`);

  //   req.on('close', () => {
  //     console.log('🔌 SSE disconnected for client:', clientId);
  //     sseSa.removeClient(clientId);
  //   });
  // }

}