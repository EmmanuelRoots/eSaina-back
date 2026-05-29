import 'dotenv/config'
import { ExceptionMiddleware } from './api/middleware/exception.middleware'
import { app } from './app'
import './api/controllers/projectStatus.controller'

app.use(ExceptionMiddleware)

app.listen(process.env.PORT, async () => {
  console.log('server stated at', process.env.PORT)
})
