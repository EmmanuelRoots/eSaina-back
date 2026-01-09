import { Controller, Get, Middlewares, Route, Tags, Request } from 'tsoa'
import { authMiddleware } from '../middleware/auth.middleware'
import { Request as ExpressRequest } from 'express'
import salonSa from '../../service/applicative/salon.sa'

@Route('salon')
@Tags('salon')
export class SalonController extends Controller {
  @Get('get-user-salon')
  @Middlewares([authMiddleware])
  public async getUserSalon(@Request() req: ExpressRequest) {
    return salonSa.getSalonListByUser((req as any).user.id)
  }
}
