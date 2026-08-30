# Architecture (End-to-End)

## Topology

```
┌──────────────────────────────┐         ┌──────────────────────────────┐
│  Jammaz-System (Frontend)    │         │  be-Jammaz (Backend)         │
│  Next.js 16 / React 19       │         │  Express + Mongoose          │
│  - App Router pages          │  /api/* │  - routes/ (Express Router)  │
│  - React Query (server state)│ ───────▶│  - services/ (business)      │
│  - RHF + Zod (forms)         │ (proxy) │  - repositories/ (data)      │
│  - shadcn/ui components      │         │  - models/ (Mongoose)        │
│  - jsPDF / jspdf-autotable   │         │  - validations/ (Zod)        │
└──────────────────────────────┘         └───────────────┬──────────────┘
                                                         │
                                                         ▼
                                              ┌────────────────────────┐
                                              │  MongoDB (mongoose)     │
                                              │  collections: customers,│
                                              │  suppliers, invoices,   │
                                              │  treasurytransactions,  │
                                              │  treasurybalances, debts│
                                              └────────────────────────┘
```

## Request Flow

1. Browser → Next.js page/component.
2. Client `services/*.js` build a request via `lib/api-utils` `api.get/post/...`
   (`Jammaz-System/src/lib/api-utils.js`). Base URL is `NEXT_PUBLIC_API_URL` or, when empty,
   same-origin `/api/*`.
3. `next.config.mjs` rewrite sends `/api/:path*` → `API_PROXY_TARGET` (default `127.0.0.1:5050`,
   fallback `:5050`). In Docker it is `http://backend:5000`.
4. Backend `index.js` mounts routers; `authMiddleware` validates the JWT (HS256, cookie `token`),
   attaches `req.user`. `roleMiddleware` enforces role sets per route.
5. Route → `Service` → `Repository` → `Model` → MongoDB. Response envelope: `{ success, data }`.
6. `api-utils` unwraps `data` on success or throws `JammazApiError` on failure.

## Auth & Sessions

- JWT signed HS256; secret from `JWT_SECRET` (must match frontend `middleware.js` verifier) and
  backend `lib/auth.js`.
- Cookie `token` (HttpOnly). Middleware (`Jammaz-System/src/middleware.js`) guards `(protected)`
  routes and redirects unauthenticated users to `/login`.
- Backend `authMiddleware` (`be-Jammaz/middlewares/authMiddleware.js`) checks `tokenVersion` against
  `User.tokenVersion` so revoked sessions die.

## Roles

`owner` (full), `manager`, `cashier`, `warehouse`, `viewer` — defined in both
`Jammaz-System/src/lib/permissions.js` and enforced server-side in
`be-Jammaz/middlewares/authMiddleware.js` (`roleMiddleware`).

## Tech Stack Summary

| Concern | Frontend | Backend |
|---------|----------|---------|
| Framework | Next.js 16 App Router | Express 4 |
| Language | JS (jsx) | JS (ESM, `"type":"module"`) |
| State | React Query + RHF | n/a |
| Validation | Zod (light) | Zod (`validations/validators.js`) |
| DB | — | Mongoose 8 / MongoDB |
| UI | Tailwind + shadcn/ui | — |
| Export libs | jsPDF, jspdf-autotable | none (no `/api/export`) |
| Tests | Jest | Vitest |

## Scaling / Perf Notes (from source)

- Express `express.json({ limit: '1mb' })`, `compression()`, `helmet()`, `mongoSanitize()`, `hpp()`.
- Rate limiting: global 300/15m; auth 10/15m; heavy (`/reports`,`/dashboard`,`/accounting/ledger`) 30/15m.
- `TreasuryBalance` is a single cached doc (T-PERF-03) bumped transactionally; readers lazily rebuild.
- `getTransactions` is page/date capped (T-PERF-01: max 90d window, max page size `MAX_LIMIT`).
