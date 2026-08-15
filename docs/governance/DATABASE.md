# Database Documentation

## Governance Rules
- [x] Schema changes managed via Prisma migrations
- [x] Prisma schema versioned in prisma/schema.prisma
- [x] npm run db:backup script available
- [x] Migration rollback supported via Prisma migrate
- [x] Input sanitization middleware applied

## Commands
- `npm run db:migrate` — Apply migrations
- `npm run db:migrate:dev` — Development migrations
- `npm run db:backup` — Backup database
- `npm run db:seed` — Seed data