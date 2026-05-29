import dotenv from 'dotenv'
import path from 'path'

// Résolution explicite depuis __dirname (dist/) pour être indépendant du CWD de PM2.
// Sans ça, `dotenv/config` cherche .env dans process.cwd(), qui peut varier selon
// comment PM2 a lancé le process (restart depuis un autre répertoire → .env introuvable).
dotenv.config({ path: path.resolve(__dirname, '../.env') })

import { ExceptionMiddleware } from './api/middleware/exception.middleware'
import { app } from './app'
import './api/controllers/projectStatus.controller'

app.use(ExceptionMiddleware)

const port = process.env.PORT ?? 3000
const corsOrigin = process.env.CORS_ORIGIN ?? '(non défini — fallback localhost)'
console.log(`[boot] PORT=${port} | CORS_ORIGIN=${corsOrigin}`)

app.listen(port, async () => {
  console.log(`[boot] Serveur démarré sur le port ${port}`)
})
