import cors from 'cors'
import Express from 'express'
import swaggerUI from 'swagger-ui-express'

import { RegisterRoutes } from './routes'

import fs from 'fs'

export const app = Express()
app.use(cors())
app.use(Express.json({ limit: '50mb' }))
app.use(Express.static('swagger'))

app.get('/', (req, res) => {
  res.send('Hello')
})

const swaggerDocument = JSON.parse(fs.readFileSync('swagger/swagger.json', 'utf8'))
app.use(
  '/swagger',
  swaggerUI.serve as unknown[] as Express.RequestHandler[],
  swaggerUI.setup(swaggerDocument) as unknown as Express.RequestHandler
)

RegisterRoutes(app)
