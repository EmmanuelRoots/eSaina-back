# 🚀 Mon Backend – Node.js + TypeScript + PostgreSQL + Prisma + TSOA

Template prêt-à-l’emploi pour une API REST documentée avec Swagger, base PostgreSQL dans Docker.

## 📦 Prérequis
- Node.js ≥ 18
- Docker & Docker Compose
- Git

## 🔧 1. Cloner le projet
```bash
git clone https://github.com/EmmanuelRoots/eSaina-back.git
cd mon-backend
```

## 2. Lancer PostgreSQL via Docker Compose si base de données sur docker
```bash
docker compose up -d
```
## 3. Variables d’environnement
DATABASE_URL="postgresql://<user>:<password>@localhost:5433/e_saina"

## 4.  Installer les dépendances
```bash
npm install
```

## 5. Générer le client Prisma
```bash
npx prisma generate
```

## 6. Créer / Appliquer les migrations
```bash
npx prisma migrate deploy
```

## 7. Vérifier les tables si sur docker
```bash
docker exec -it postgres_container_bemsa psql -U bemsa -d e_saina -c "\dt"
```
