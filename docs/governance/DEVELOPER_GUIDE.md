# Sarathi AI Developer Guide

## Module Structure
Each domain module contains:
- `types.ts` — Type definitions
- `*Engine.ts` — Business logic entry point
- `index.ts` — Public barrel exports

## Integration Pattern
1. Create `runXEngine()` in module
2. Wire into `engineeringAIExpertEngine.ts`
3. Add prompt augmentation when `result.active === true`
4. Register in governance architecture registry

## Coding Standards
- Domain modules use kebab-case folder names (e.g. knowledge-capture, site-execution).
- Engine entry points use run*Engine or *Engine.ts naming.
- Shared types live in types.ts within each module.
- Each module contains types.ts, *Engine.ts, and index.ts barrel export.
- AI infrastructure lives under frontend/src/ai and backend/src/ai.
- Plugin framework lives under */plugins with manager, registry, loader, sandbox, API.
- Public module API is exported through index.ts only.
- Backend imports use .js extensions for ESM compatibility.
- Each sprint module documents integration via prompt augmentation pattern.
- Architecture sprints must not redesign UI — chat-driven modules only.
- REST APIs are versioned under /api/v1.
- API responses use { success, data } or { success, error } envelope.
- Database access uses Prisma with migration-based schema changes.
- Backup script available via npm run db:backup.