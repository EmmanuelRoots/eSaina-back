import cors from 'cors'
import Express from 'express'
import swaggerUI from 'swagger-ui-express'

import { RegisterRoutes } from './api/routes/routes'

import fs from 'fs'
import { authMiddleware } from './api/middleware/auth.middleware'
import sseSa from './service/applicative/sse.sa'

export const app = Express()
app.use(cors())
app.use(Express.json({ limit: '50mb' }))
app.use(Express.static('swagger'))

app.get('/', (req, res) => {
  res.send('Hello')
})

app.get('/notification/stream',(req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).send('userId manquant');

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const clientId = sseSa.addClient(userId, res);

  res.write(`event: CONNECTED\ndata: ${JSON.stringify({ userId, clientId })}\n\n`);
  console.log('Client connecte');
  

  req.on('close', () => {
    console.log('client deconnecte');
    
    sseSa.removeClient(clientId);
  });
});

const swaggerDocument = JSON.parse(fs.readFileSync('swagger/swagger.json', 'utf8'))
app.use(
  '/swagger',
  swaggerUI.serve as unknown[] as Express.RequestHandler[],
  swaggerUI.setup(swaggerDocument) as unknown as Express.RequestHandler
)

RegisterRoutes(app)
