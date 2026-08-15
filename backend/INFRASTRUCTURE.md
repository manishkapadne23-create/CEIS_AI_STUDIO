# Sarathi AI — Production Infrastructure

## Overview

Production-ready backend infrastructure for Sarathi AI with environment-based configuration, centralized logging, versioned REST APIs, security middleware, caching, file storage, background jobs, and monitoring.

## Quick Start

```bash
# Development
cp .env.example .env
npm install
npx prisma migrate dev
npm run db:seed
npm run dev

# Production (Docker)
docker compose up -d
```

## API Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/v1/health` | Full system health (DB, AI, cache) |
| `GET /api/v1/health/live` | Liveness probe |
| `GET /api/v1/health/ready` | Readiness probe |
| `GET /api/v1/metrics` | Performance metrics |
| `POST /api/v1/auth/login` | JWT authentication |
| `POST /api/v1/ai/chat` | AI chat (standard response format) |
| `POST /api/chat` | Legacy AI chat endpoint |

## Standard Response Format

```json
{ "success": true, "data": { ... }, "message": "optional" }
{ "success": false, "error": { "code": "ERROR_CODE", "message": "..." } }
```

## Environments

| File | Purpose |
|------|---------|
| `.env.example` | Development defaults |
| `.env.testing.example` | Test environment |
| `.env.production.example` | Production template |

Set `NODE_ENV` to `development`, `testing`, or `production`.

## Architecture

```
src/
  config/           Environment configuration
  infrastructure/
    logger/         App, AI, API, error, audit logs
    cache/          Redis-ready session/knowledge/AI cache
    storage/        Documents, images, reports, temp files
    queue/          Background job queue
    retry/          Retry with exponential backoff
  middleware/       Security, rate limit, validation, errors
  monitoring/       Health checks and metrics
  jobs/             Notifications, email, maintenance
  api/v1/           Versioned REST API routes
```

## Security

- JWT authentication with configurable expiry
- RBAC via `authorize(["ADMIN", "USER"])` middleware
- Security headers (CSP, HSTS, X-Frame-Options)
- Rate limiting (general + AI-specific)
- Input validation and output sanitization
- CORS configuration per environment

## Database

```bash
npm run db:migrate:dev    # Development migrations
npm run db:migrate        # Production deploy migrations
npm run db:seed           # Seed engineering domains
npm run db:backup         # PostgreSQL backup (requires pg_dump)
```

Connection pooling configured via `DB_POOL_MAX` and Prisma URL params.

## Testing

```bash
npm test                  # All tests
npm run test:unit         # Unit tests
npm run test:integration  # API integration tests
```

## Docker

```bash
docker compose up -d      # Postgres + Redis + Backend + Frontend
```

Backend health check: `GET /api/v1/health/live`

## Future-Ready Hooks

- Redis cache (set `REDIS_URL`)
- Enterprise / institution dashboards
- PMIS executive dashboard integration
- SMTP email in background jobs
