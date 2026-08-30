# Backend Architecture (`be-Jammaz`)

## Layering

```
routes/        Express routers. Mount auth + role middleware, run Zod validate(), call Services.
  │
services/      Business logic. Orchestrate repositories, models, treasury, accounting, logs.
  │  (financial/ sub-services: sale, purchase, payment, return, expense, debt)
repositories/  Thin data-access wrappers (customer, debt, invoice, product, user).
  │
models/        Mongoose schemas (26 collections).
  │
validations/   Canonical Zod schemas (single source of truth for external input).
lib/           db, auth, validate, route-handler, permissions, paginate, errors.
middlewares/   authMiddleware (JWT+role), errorHandler, (rate-limit in index.js).
```

## Entry Point — `index.js`

- Connects Mongo, applies `helmet`, `mongoSanitize`, `hpp`, CORS (origin allowlist), `compression`,
  `express.json({limit:'1mb'})`.
- Rate limits: global 300/15m; auth 10/15m; heavy (`/reports`,`/dashboard`,`/accounting/ledger`) 30/15m.
- Mounts routers under `/api/*`. **No `/api/export` router exists.**
- `errorHandler` normalizes errors to `{ success:false, message }`.

## Route → Concern Map

| Router | Mount | Key endpoints |
|--------|-------|---------------|
| `authRoutes` | `/api/auth` | login, google, refresh |
| `customerRoutes` | `/api/customers` | CRUD, `/:id/pricing`, `/:id/statement`, `POST /:id/pay` |
| `supplierRoutes` | `/api/suppliers` | CRUD |
| `invoiceRoutes` | `/api/invoices` | create/get |
| `purchaseRoutes` | `/api/purchase-orders` (+ deprecated `/api/purchases`) | CRUD, receive |
| `treasuryRoutes` | `/api/treasury` | balance, summary, daily, reconcile, transactions, manual-income/expense, undo |
| `financeRoutes` | `/api/financial` | payments/customer, payments/unified, payments/supplier, payments/debt, returns, expenses, debts, installments, transaction, receipts, partner transactions |
| `accountingRoutes` | `/api/accounting` | ledger, journal entries |
| `reportRoutes` | `/api` (dashboard/reports) | `/dashboard`, `/reports/sales`, `/reports/financial`, `/reports/customer-profit`, `/reports/inventory`, `/reports/shortage`, `/reports/price-history` — **JSON only** |
| `productRoutes`, `stockRoutes`, `userRoutes`, `logRoutes`, `notificationRoutes`, `physicalInventoryRoutes`, `dailySalesRoutes`, `pricingRoutes`, `settingsRoutes`, `docsRoutes` | — | — |

## Validation Flow

`lib/validate.js` `validate(schema)` runs `req.body` through Zod and throws `BadRequestError` on failure.
Canonical schemas: `validations/validators.js`. All external input must pass through these.

## Authorization Model

- `authMiddleware` (all routes except `auth`/`docs`) populates `req.user` from JWT.
- `roleMiddleware(['owner','manager'])` gates mutating financial actions.
  - Cashiers may only `POST /api/financial/payments/customer` (no role guard) and presumably create invoices.
  - Unified collection, supplier payment, debt payment, expense, returns, manual transactions, reconcile
    require `owner`/`manager`. Undo transaction requires `owner`.

## Service Highlights

- `FinanceService` (facade) delegates to `financial/{sale,purchase,payment,return,expense}Service`.
- `TreasuryService` is the **single choke point** for all treasury writes: `_createTransactions`
  (writes `TreasuryTransaction` + bumps `TreasuryBalance` in one session), `_deleteTransaction`,
  `_applyBalanceDelta`, `updateDailyCashbox` (atomic `$inc` per method), `getSummary` (aggregates
  breakdown by method), `buildReceipt`.
- `PaymentService` implements `recordCustomerPayment`, `recordTotalCustomerPayment` (unified),
  `recordSupplierPayment`, `recordManualDebtPayment`, `settleDebt`, each wrapped in
  `withTransaction`+`withRetry` (T-BIZ-01 all-or-nothing).

## Error Handling

`lib/errors.js` defines `BadRequestError`, `NotFoundError`, `UnauthorizedError`, `ForbiddenError`,
`ConflictError`. `route-handler.js` wraps handlers so thrown errors become uniform envelopes.

## Testing

Vitest + `mongodb-memory-server` (supertest). `tests/helpers.js` provides `createTestApp`,
`seedUser`. Fault-injection hooks (`FAULT_INJECT` env) exist in payment/purchase services for
concurrency testing.

## Known Backend Tech Debt (relevant)

- `UnifiedCollection` model is a surrogate (`strict:false`) over the `customers` collection used only
  as a `refPath` target (`models/UnifiedCollection.js`). Fragile; revisit during unification.
- `TreasuryTransaction.method` enum includes `'adjustment'`, but the shared `paymentMethod` Zod enum
  (`validators.js:26`) omits `'adjustment'` and `'instapay'` → schema/runtime drift.
- No `--export` route; export is unimplemented server-side.
- `TreasuryService.addManualIncome/addManualExpense` contain a confused comment block (lines ~328) about
  `CashboxDaily.addIncome` behavior — verify before extending.
