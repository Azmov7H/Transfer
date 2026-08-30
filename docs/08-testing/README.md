# 08 — Testing Plan

Covers unit, integration, E2E, and the required test matrix. Backend uses Vitest + `mongodb-memory-server`
+ supertest; frontend uses Jest + RTL (per `package.json`).

## 08.1 — Unit Tests

- **T-UNIT-001** `requiresSourceNumber(method)` → true for `instapay`,`wallet`; false otherwise.
- **T-UNIT-002** Zod `paymentMethod` enum includes `instapay` and `adjustment`.
- **T-UNIT-003** Validation superRefine: missing `sourceNumber` for `instapay`/`wallet` → issue on `sourceNumber`;
  empty `sourceNumber` for `cash`/`bank` → passes.
- **T-UNIT-004** `METHOD_CASHBOX` / `fieldFor(method,type)` returns instapay fields and matches existing mapping.
- **T-UNIT-005** `CashboxDaily.pre('save')` computes `closingInstapayBalance` correctly.
- **T-UNIT-006** `PartyService.detectDuplicates` returns expected candidate pairs on seeded data.
- **T-UNIT-007** CSV serializer (`lib/exportCsv.js`) emits BOM + correct columns + Arabic.

## 08.2 — Integration Tests (backend, supertest + memory mongo)

- **T-INT-001** Record sale via `instapay` with `sourceNumber` → 200; `TreasuryBalance` delta correct;
  `cashboxdailies.instapayIncome` incremented; `TreasuryTransaction.sourceNumber` stored.
- **T-INT-002** Record sale via `instapay` **without** `sourceNumber` → 400 (validation).
- **T-INT-003** Record sale via `cash` without `sourceNumber` → 200 (optional).
- **T-INT-004** Customer collection via `wallet` with/without `sourceNumber` → 200 / 400.
- **T-INT-005** Supplier payment via `instapay` with/without `sourceNumber` → 200 / 400.
- **T-INT-006** Unified collection via `instapay` with source → 200; balances + treasury correct.
- **T-INT-007** Manual debt payment (Customer & Supplier) via `wallet` requires source.
- **T-INT-008** `getSummary` breakdown includes `instapay` net.
- **T-INT-009** Party link: idempotent; prevents self-link; `getNetPosition` sums native balances.
- **T-INT-010** Party unlink reverts to unlinked state (rollback).
- **T-INT-011** Export: authorized → file; unauthorized → 403; wrong filter → sanitized/empty; 100k rows → completes.
- **T-INT-012** Treasury balance reconciliation matches `sum(INCOME)-sum(EXPENSE)` after mixed-channel txns.

## 08.3 — Frontend Tests (Jest + RTL)

- **T-FE-001** `PaymentDialog` renders `instapay` option; selecting it shows `SourceNumberField`; empty submit blocked.
- **T-FE-002** `SourceNumberField` visible only for instapay/wallet; hidden for cash/bank/check.
- **T-FE-003** `TreasuryStatsCards` renders instapay tile from `breakdown.instapay`.
- **T-FE-004** Customer detail shows "net position" when linked.
- **T-FE-005** `ExportButton` Excel path hits real `/api/export` (mock fetch) and honors `filters` prop; no 404.

## 08.4 — E2E Tests (if harness available)

- **T-E2E-001** Full sale: choose InstaPay → enter source → complete → verify receipt + treasury + cashbox.
- **T-E2E-002** Customer becomes supplier (link) → both roles visible → net position correct.
- **T-E2E-003** Export Customers with filter → downloaded file contains filtered rows only.

## 08.5 — Required Test Matrix (from master prompt §24, extended)

| # | Scenario | Payment Method | Source Number | Expected |
|---|----------|----------------|--------------|----------|
| 1 | Sale | Private Treasury (cash) | empty | ✅ Success |
| 2 | Sale | InstaPay | present | ✅ Success |
| 3 | Sale | InstaPay | empty | ❌ Reject |
| 4 | Sale | Cash Wallet (wallet) | present | ✅ Success |
| 5 | Sale | Cash Wallet (wallet) | empty | ❌ Reject |
| 6 | Collection | Private Treasury | empty | ✅ Success |
| 7 | Collection | InstaPay | present | ✅ Success |
| 8 | Collection | InstaPay | empty | ❌ Reject |
| 9 | Collection | Cash Wallet | present | ✅ Success |
| 10 | Collection | Cash Wallet | empty | ❌ Reject |
| 11 | Supplier Payment | Private Treasury | empty | ✅ Success |
| 12 | Supplier Payment | InstaPay | present | ✅ Success |
| 13 | Supplier Payment | InstaPay | empty | ❌ Reject |
| 14 | Supplier Payment | Cash Wallet | present | ✅ Success |
| 15 | Supplier Payment | Cash Wallet | empty | ❌ Reject |
| 16 | Manual Expense | InstaPay | present | ✅ Success |
| 17 | Manual Expense | InstaPay | empty | ❌ Reject |
| 18 | Sales Return refund | InstaPay (destination) | present(opt) | ✅ Success (capture destination) |
| 19 | Bank transfer | bank | empty | ✅ Success (source optional per business) |
| 20 | Historical txn (pre-change) | wallet (legacy, no source) | empty | ✅ Valid (no rejection on read/migration) |

Full matrix with test IDs stored in `08-testing/test-matrix.md` (companion file).
