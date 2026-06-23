# EduLedger

A fees reconciliation platform, organized as a **monorepo** (npm workspaces).

```
EduLedger/
├── package.json              # workspace root — scripts orchestrate all apps
├── tsconfig.base.json        # shared TS compiler options + path aliases
├── apps/
│   ├── api/                  # backend — Express modular monolith (TypeScript)
│   └── web/                  # frontend — Next.js App Router (TypeScript)
└── packages/
    └── shared/               # @eduledger/shared — types/contracts both apps import
```

## The web app (`apps/web`)

Next.js (App Router) + Tailwind + shadcn/ui, with TanStack Query + Axios for
server state and Zustand for client/session state. It mirrors the backend's
module boundaries with a `features/` layout — one folder per backend module.

```
apps/web/
├── next.config.mjs           # rewrites /api/* → backend; transpiles @eduledger/shared
├── tailwind.config.ts
├── components.json           # shadcn/ui config
└── src/
    ├── app/                  # App Router (routes only)
    │   ├── layout.tsx        # root layout → mounts Providers
    │   ├── providers.tsx     # TanStack Query (client boundary)
    │   ├── globals.css       # Tailwind + shadcn design tokens
    │   ├── page.tsx          # public landing
    │   ├── (auth)/           # route group: login, register
    │   └── (dashboard)/      # route group: app shell + dashboard/payments/…
    ├── features/             # one folder per backend module — the core of the app
    │   ├── auth/             # api.ts · hooks.ts · schemas.ts · types.ts · components/
    │   ├── users/
    │   ├── payments/
    │   └── reconciliation/
    ├── components/
    │   ├── ui/               # shadcn/ui primitives (Button included; add more via CLI)
    │   └── layout/           # app shell, sidebar
    ├── lib/
    │   ├── api-client.ts     # axios instance (auth header + error normalization)
    │   ├── query-client.ts   # TanStack Query factory
    │   └── utils.ts          # cn() helper
    ├── stores/               # Zustand stores (auth/session)
    ├── hooks/                # cross-feature React hooks
    ├── types/                # re-exports @eduledger/shared + web-only UI types
    └── config/               # typed public env access
```

### Feature module convention

Each `features/<name>/` is self-contained and layered like the backend module
it pairs with:

| File          | Responsibility                                  |
| ------------- | ----------------------------------------------- |
| `api.ts`      | Transport — calls `apiClient`, returns raw data |
| `hooks.ts`    | TanStack Query hooks wrapping `api.ts`          |
| `schemas.ts`  | Zod form/input schemas (mirror backend rules)   |
| `types.ts`    | Feature types (re-export `@eduledger/shared`)   |
| `components/` | Feature-specific UI                             |

The backend lives in `apps/api` and is documented in its own README.

## Getting started

```bash
npm install                # installs every workspace
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.local.example apps/web/.env.local

# run them separately (recommended — distinct ports):
npm run dev:api
npm run dev:web
# or both at once:
npm run dev
```

> Note: the API defaults to `PORT=3000` and the Next.js dev server also uses
> `3000`. Give them distinct ports — e.g. run the API on 3001 and set
> `BACKEND_URL=http://localhost:3001` in `apps/web/.env.local` so the Next.js
> `/api` rewrite proxies correctly.

## Adding shadcn/ui components

```bash
cd apps/web
npx shadcn@latest add input form card table dialog
```
