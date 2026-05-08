# Backend Mariage (NestJS + Prisma + PostgreSQL)

API de gestion des cérémonies, invités et check-in.

## 1) Prérequis

- Node.js 20+
- PostgreSQL (installé localement ou sur un serveur)

## 2) Variables d’environnement

Copie le fichier d’exemple puis adapte les accès PostgreSQL:

```bash
cp .env.example .env
```

Exemple:

```env
DATABASE_URL="postgresql://mariage_user:mariage_pass@localhost:5432/mariage_db?schema=public"
PORT=3000
```

## 3) Installer et initialiser la base

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

## 4) Lancer l’API

```bash
npm run start:dev
```

API disponible sur `http://localhost:3000`.

## Documentation API (avec exemples + test)

- Swagger UI: `http://localhost:3000/api`
- JSON OpenAPI: `http://localhost:3000/api-json`

La doc contient des exemples pour chaque endpoint (request/response) et permet de tester via **Try it out**.

## CORS

Le backend autorise déjà l’origine frontend de dev:
- `http://localhost:4200`

## Scripts utiles

```bash
npm run build
npm run test
npm run test:e2e
```
