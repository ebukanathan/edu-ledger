# @eduledger/api

A fees reconciliation platform — built as a **modular monolith**.

## Architecture

A single deployable app, internally split into self-contained business modules.
Each module owns its data and exposes a narrow public API (`index.ts`). Modules
never import each other's internals; they talk through the public API or the
in-process event bus (`src/shared/events`). This keeps boundaries crisp so any
module can later be extracted into its own service.

```
src/
├── index.ts              # process entry
├── server.ts             # http server bootstrap
├── app.ts                # express wiring (middleware, routes)
├── routes.ts             # mounts each module's routes under /api
├── config/               # env loading + typed config
├── modules/              # business modules (the monolith's "cells")
│   ├── auth/
│   ├── users/
│   ├── payments/
│   └── reconciliation/
│       ├── *.routes.ts       # http routes
│       ├── *.controller.ts   # request/response handling
│       ├── *.service.ts      # business logic
│       ├── *.repository.ts   # data access (owns its tables)
│       ├── *.validation.ts   # input schemas
│       ├── *.types.ts        # domain types
│       └── index.ts          # PUBLIC API — only thing other modules import
├── shared/               # cross-cutting, no business logic
│   ├── middleware/
│   ├── errors/
│   ├── events/           # in-process event bus (the inter-module seam)
│   ├── utils/
│   └── types/
└── database/             # connection, migrations, seeds
tests/
├── unit/
└── integration/
```

## Module rules

1. A module may only import another module via its `index.ts`.
2. A module owns its own tables; cross-module data goes through the public API.
3. Prefer the event bus for side effects (e.g. `payment.recorded` →
   reconciliation reacts) to keep modules decoupled.

## Shared contracts

Types shared with the frontend live in `@eduledger/shared` (`packages/shared`).
Import domain DTOs from there rather than redefining them.

## Getting started

From the repo root:

```bash
npm install            # installs all workspaces
cp apps/api/.env.example apps/api/.env
npm run dev:api        # or `npm run dev` to run api + web together
```
