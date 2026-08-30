# 00 — Current System Map (Overview)

This folder documents the **existing** Jammaz System as discovered from source code (not from
README assumptions — the repository README is outdated and references files that no longer exist,
e.g. `src/app/api`, `src/models`, `scripts/seed.js`).

## Components Discovered

| Document | Scope |
|----------|-------|
| `architecture.md` | End-to-end system topology, request flow, tech stack |
| `frontend-architecture.md` | Next.js App Router structure, state, components, services |
| `backend-architecture.md` | Express service-repository layering, routing, middleware |
| `database-architecture.md` | MongoDB collections, relationships, indexes |
| `financial-architecture.md` | Treasury, payments, debts, accounting entries |
| `customer-supplier-architecture.md` | Party model, balances, unification status |
| `export-architecture.md` | Every export implementation and its defects |
| `dependency-map.md` | Module dependency graph |

## Important Caveat for Implementers

The repository is split:

- **Frontend repo** (`Jammaz-System`) — what you run with `next dev`. It contains NO server logic;
  all `/api/*` calls are proxied to the backend.
- **Backend repo** (`be-Jammaz`, sibling directory) — Express + Mongoose. This is where all data
  models, validation, business logic, and (missing) export endpoints live.

Any change to data shape, validation, or treasury behavior requires edits in **`be-Jammaz`**, plus
matching frontend changes in `Jammaz-System`. Cross-repo coordination is mandatory.

## Existing Directory Inventory (non-exhaustive)

Frontend (`Jammaz-System/src`):
- `app/(protected)/` — dashboard, financial, customers, suppliers, invoices, purchase-orders,
  sales-returns, accounting, reports, physical-inventory, daily-sales, (admin), (finance), (operations)
- `components/` — accounting, auth, common, customers, dashboard, financial, forms, invoices,
  products, reports, settings, sidebar, stock, suppliers, users, notifications, physical-inventory
- `services/` — client-side API contracts (`financeService`, `treasuryService`, `customerService`, …)
- `hooks/` — React Query hooks (`useFinancial`, `useInvoices`, `useCustomers`, …)
- `validations/` — Zod client schemas (thin; canonical schemas live in backend)
- `lib/` — `api-utils` (fetch wrapper, JWT session handling), `permissions`

Backend (`be-Jammaz`):
- `routes/` — `financeRoutes`, `treasuryRoutes`, `customerRoutes`, `supplierRoutes`,
  `invoiceRoutes`, `purchaseRoutes`, `reportRoutes`, `accountingRoutes`, `authRoutes`, …
- `services/` — `financeService` (facade) → `financial/{sale,purchase,payment,return,expense,debt}Service`,
  `treasuryService`, `customerService`, `supplierService`, `accountingService`, `reportingService`, …
- `repositories/` — `customerRepository`, `debtRepository`, `invoiceRepository`, `productRepository`, `userRepository`
- `models/` — 26 Mongoose schemas (full list in `database-architecture.md`)
- `validations/` — `validators.js` (canonical Zod schemas — single source of truth)
- `middlewares/` — `authMiddleware` (JWT + role), `errorHandler`, `rateLimit` (in `index.js`)
- `lib/` — `db`, `auth`, `validate`, `route-handler`, `permissions`, `paginate`, `errors`
