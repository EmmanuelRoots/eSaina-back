/**
 * Configuration principale de l'application Express.
 *
 * Responsabilités :
 * - Middlewares de sécurité : Helmet (headers HTTP), CORS restrictif, rate limiting.
 * - Parsing JSON limité à 1 MB (protection contre les requêtes volumineuses).
 * - Endpoint SSE `/notification/stream` (hors TSOA, auth via JWT en query param).
 * - Swagger UI (local uniquement, bloqué par Nginx en production).
 * - Enregistrement des routes TSOA générées.
 */
import cors from 'cors'
import Express from 'express'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import swaggerUI from 'swagger-ui-express'
import fs from 'fs'

import { RegisterRoutes } from './api/routes/routes'
import sseSa from './service/applicative/sse.sa'
import { prisma } from './repository'
import { verifyAccess } from './utils/jwt'

export const app = Express()

// ── Trust proxy ───────────────────────────────────────────────────────────────
// En production, le backend est derrière nginx (1 hop). Express doit faire
// confiance au X-Forwarded-For envoyé par nginx pour que express-rate-limit
// puisse identifier les IPs clientes réelles.
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1)
}

// ── Headers de sécurité HTTP ──────────────────────────────────────────────────
// Helmet injecte X-Content-Type-Options, X-Frame-Options, HSTS, CSP, etc.
app.use(helmet())

// ── CORS ──────────────────────────────────────────────────────────────────────
// CORS_ORIGIN est injecté depuis .env en production.
// En dev, on retombe sur l'origine Vite locale.
const corsOrigin = process.env.CORS_ORIGIN ?? 'http://localhost:5173'

app.use(
  cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true,
  })
)

// ── Parsing JSON — limité à 1 MB ───────────────────────────────────────────────
// La limite précédente à 50 MB était un vecteur d'attaque DoS par payload surdimensionné.
app.use(Express.json({ limit: '1mb' }))
app.use(Express.static('swagger'))

// ── Rate limiting sur les endpoints d'authentification ────────────────────────
// 10 tentatives max par IP sur 15 minutes pour /user/login, /user/subscribe,
// /user/refresh. Protège contre le brute-force de mots de passe et l'abus de tokens.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    statusCode: 429,
    message: 'Too many requests, please try again later.',
  },
})
app.use('/user/login', authLimiter)
app.use('/user/subscribe', authLimiter)
app.use('/user/refresh', authLimiter)

// ── Route de santé ────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.send('Hello')
})

// ── Endpoint SSE — hors TSOA ──────────────────────────────────────────────────
// Les EventSource natifs ne supportent pas les en-têtes HTTP personnalisés ;
// le JWT est donc transmis via le query param `token`.
// L'userId est vérifié pour s'assurer que le token appartient bien au demandeur.
app.get('/notification/stream', async (req, res) => {
  const userId = req.query.userId as string
  const token = req.query.token as string

  if (!userId || !token) {
    return res.status(400).json({ success: false, message: 'userId et token requis' })
  }

  try {
    const payload = verifyAccess(token)
    if (payload.user.id !== userId) {
      return res
        .status(403)
        .json({ success: false, message: 'Token ne correspond pas à cet userId' })
    }
  } catch {
    return res.status(401).json({ success: false, message: 'Token invalide ou expiré' })
  }

  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')

  const clientId = sseSa.addClient(userId, res)
  await prisma.user.update({ where: { id: userId }, data: { connected: true } })
  res.write(`event: CONNECTED\ndata: ${JSON.stringify({ userId, clientId })}\n\n`)

  req.on('close', async () => {
    await prisma.user.update({ where: { id: userId }, data: { connected: false } })
    sseSa.removeClient(clientId)
  })
})

// ── Swagger UI (accessible localement ; bloqué par Nginx en production) ───────
const swaggerDocument = JSON.parse(fs.readFileSync('swagger/swagger.json', 'utf8'))
app.use(
  '/swagger',
  swaggerUI.serve as unknown[] as Express.RequestHandler[],
  swaggerUI.setup(swaggerDocument) as unknown as Express.RequestHandler
)

RegisterRoutes(app)
