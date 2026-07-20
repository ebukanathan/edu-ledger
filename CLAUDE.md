# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

EduLedger — a fees reconciliation platform for schools. npm-workspaces monorepo:

```
apps/api/        @eduledger/api  — Express modular monolith (TypeScript, Prisma 7 + Postgres)
apps/web/        @eduledger/web  — Next.js 14 App Router client
packages/shared/  @eduledger/shared — types/contracts imported by both apps
```

## Commands

Run from the repo root unless noted.

```bash
npm install                          # installs all workspaces

# dev — API and web MUST run on different ports (both default to 3000).
# apps/api/.env sets PORT=3001; apps/web/.env.local sets BACKEND_URL=http://localhost:3001
# so the Next.js rewrite proxies /api/* to the right place.
npm run dev:api                      # backend only (ts-node-dev, auto-restart)
npm run dev:web                      # frontend only
npm run dev                          # both, backgrounded in one shell

npm run build                        # build --workspaces --if-present
npm run typecheck                    # typecheck --workspaces --if-present
npm run test                         # test --workspaces --if-present (currently api only)
```

Per-workspace (run inside `apps/api` or `apps/web`, or via `--workspace`):

```bash
npm run typecheck --workspace @eduledger/api    # tsc --noEmit
npm run test --workspace @eduledger/api         # jest
cd apps/api && npx jest tests/onboarding-flow.integration.test.ts   # single test file
cd apps/api && npx jest -t "tenant isolation"                        # by test name

npm run lint --workspace @eduledger/web         # next lint

# Prisma (schema lives in apps/api/prisma/, NOT the stub at repo root — see below)
cd apps/api
npx prisma migrate dev --name <change>          # create + apply a migration
npx prisma generate                             # regenerate client into src/generated/prisma
npm run db:seed                                 # bootstraps the first PLATFORM_ADMIN (needs PLATFORM_ADMIN_EMAIL/PASSWORD in .env)

# shadcn/ui components
cd apps/web && npx shadcn@latest add <component>
```

There's a `prisma/schema.prisma` at the repo root — it's a leftover stub with no models and is not used by anything. The real schema, migrations, and seed script are in `apps/api/prisma/`.

## Backend architecture (`apps/api`)

A single Express deployable, internally split into self-contained business modules under `src/modules/` (`auth`, `platform`, `users`, `payments`, `reconciliation`). Each module is layered:

```
<module>.routes.ts       http routes
<module>.controller.ts   request/response handling
<module>.service.ts      business logic
<module>.repository.ts   data access (owns its own tables)
<module>.validation.ts   input schemas
<module>.types.ts        domain types
index.ts                 PUBLIC API — the only thing other modules may import
```

**Module rules** (enforced by convention, not tooling — respect them when editing):
1. A module may only import another module through its `index.ts`. Never reach into another module's internals.
2. A module owns its own tables.
3. Cross-module side effects go through the in-process event bus (`src/shared/events/event-bus.ts`, a plain Node `EventEmitter`) rather than direct calls — e.g. a future `payment.recorded` event that reconciliation reacts to. This keeps modules decoupled enough to later extract one into its own service.

`src/shared/` is cross-cutting and must not contain business logic: `middleware/` (auth, error-handler, request-logger), `errors/app-error.ts` (`AppError` subclasses: `NotFoundError`, `ValidationError`, `UnauthorizedError`, `ForbiddenError` — thrown from anywhere and caught by the central `errorHandler`), `events/`, `utils/`.

`src/database/index.ts` exports a single shared `prisma` client (Prisma 7, connected via `@prisma/adapter-pg` rather than a bundled query engine — don't instantiate `PrismaClient` elsewhere).

### Auth & tenant model

Roles (`Role` enum in the Prisma schema): `PLATFORM_ADMIN`, `SCHOOL_ADMIN`, `FINANCE_OFFICER`, `TEACHER`, `ADMISSIONS_OFFICER`.

- `PLATFORM_ADMIN` users have `schoolId: null` and operate above the tenant boundary — they onboard schools (`platform` module) and cannot be created through normal signup (there is no self-service registration).
- All other roles belong to exactly one `School` via `schoolId` and must never see or manage another school's data. This tenant-isolation guarantee is the thing `tests/onboarding-flow.integration.test.ts` exists to protect — read it before touching auth, users, or platform onboarding.
- `authenticate` (`src/shared/middleware/auth.middleware.ts`) verifies the bearer JWT and attaches `req.principal = { userId, schoolId, role }`. `authorize(...roles)` gates a route to a role set and must be mounted after `authenticate`.
- The very first `PLATFORM_ADMIN` is created out-of-band by `prisma/seed.ts` (`npm run db:seed`), since no one exists yet to onboard the onboarder. Every other user is created by someone above them in the chain: platform admin → school admin → school staff.

## Frontend architecture (`apps/web`)

Next.js App Router. `src/app/` holds routes only — one route group per access level (`(auth)`, `(dashboard)`, `platform/`). All real code lives in `src/features/<name>/`, one folder per backend module, mirroring its boundaries:

| File          | Responsibility                                  |
| ------------- | ------------------------------------------------ |
| `api.ts`      | Transport — calls `apiClient`, returns raw data   |
| `hooks.ts`    | TanStack Query hooks wrapping `api.ts`            |
| `schemas.ts`  | Zod schemas mirroring backend validation rules    |
| `types.ts`    | Feature types (re-export from `@eduledger/shared`)|
| `components/` | Feature-specific UI                               |

Cross-cutting pieces:
- `src/lib/api-client.ts` — the one axios instance every feature's `api.ts` should import. Attaches the bearer token from `useAuthStore` on each request, and normalizes backend errors into a typed `ApiError` (`{ status, message, code?, details? }`); a 401 response clears the session so route guards redirect to `/login`.
- `src/stores/auth-store.ts` — Zustand store (persisted to localStorage) holding `token`/`user`. This is session state only; the authoritative user record is fetched via TanStack Query.
- Route guarding is currently client-side: layouts (`(dashboard)/layout.tsx`, `platform/layout.tsx`) redirect anonymous visitors in a `useEffect`, not via middleware or a server check — a submitted form under these layouts would otherwise 401 instead of bouncing to login first. Keep this in mind if you add a new protected route group.
- `next.config.mjs` rewrites `/api/*` to `BACKEND_URL` (dev-only, avoids CORS) and transpiles `@eduledger/shared` since it ships raw TypeScript.

## Shared contracts (`packages/shared`)

`src/index.ts` is the only file. It holds domain enums, DTO shapes, and API response envelopes (`ApiResponse<T>`, `Paginated<T>`) that both apps must agree on — no runtime logic, no framework imports, so it stays importable from both a Node backend and a browser bundle. When a route or form changes shape, update this first and let both apps consume the change, rather than defining the type twice.

Note the deliberate mismatch: the Prisma `Role` enum is SCREAMING_CASE (`PLATFORM_ADMIN`) while the shared `UserRole` type is lower_snake (`platform_admin`). Every module converts via `toPublicRole()` (`apps/api/src/shared/constants/roles.ts`) before a `Role` value crosses into an API response — never send the Prisma enum value to the client directly.
