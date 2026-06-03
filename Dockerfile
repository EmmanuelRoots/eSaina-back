# ─── Build stage ───────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

# Dépendances système pour Prisma (openssl, libssl)
RUN apk add --no-cache openssl

WORKDIR /app

# Copie des manifestes en premier pour profiter du cache layer
COPY package.json yarn.lock ./
COPY prisma ./prisma/

# Installation des dépendances (y compris devDeps nécessaires au build)
RUN yarn install --frozen-lockfile

# Copie des sources
COPY tsoa.json tsconfig.json ./
COPY src ./src/
COPY swagger ./swagger/

# Génération du client Prisma + routes TSOA + compilation TS
RUN npx prisma generate && \
    yarn build

# ─── Runtime stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runtime

RUN apk add --no-cache openssl

WORKDIR /app

# Uniquement les dépendances de production
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production

# Artefacts du build
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/swagger ./swagger

# Client Prisma généré — les deux répertoires sont nécessaires :
# .prisma/client contient les binaires natifs compilés pour cette plateforme,
# @prisma/client contient le JS généré (index.js, types) qui les importe.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client

# Schéma Prisma requis au runtime pour les migrations
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Lance le serveur compilé
CMD ["node", "dist/index.js"]
