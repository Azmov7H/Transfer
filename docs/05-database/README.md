# 05 — Database Plan

Migration strategy, schema changes, rollback, integrity checks. **No migrations are executed during planning.**
Scripts are designed but not run.

## 05.1 — Current Schema Impact (summary)

See `00-current-system/database-architecture.md` and `02-architecture/proposed-data-model.md`. All changes are
**additive**:

| Collection | Change | Breaking? |
|------------|--------|-----------|
| `treasurytransactions` | `method` enum +`'instapay'`; new `sourceNumber` field | No (additive) |
| `cashboxdailies` | +4 instapay fields; `pre('save')` update | No (new docs only; old docs gain defaults on save) |
| `invoices` | `paymentType` +`'instapay'`; `payments[].method`+`'instapay'`; `payments[].sourceNumber` | No |
| `purchaseorders` | `paymentType` +`'instapay'` | No |
| `customers` | +`taxNumber`,`isSupplier`,`linkedSupplier` | No |
| `suppliers` | +`taxNumber?`,`isCustomer`,`linkedCustomer` | No |
| `treasurybalances` | (optional) `balancesByMethod` Map | No |

## 05.2 — Migration Scripts (designed, NOT executed)

1. **`scripts/migrate-add-instapay-channel.js`** (idempotent, dry-run capable):
   - Uses `updateMany` with `$setOnInsert`/default assignment is unnecessary because new fields default.
   - For `cashboxdailies`: backfill `instapayIncome:0, instapayExpenses:0, openingInstapayBalance:0,
     closingInstapayBalance:0` for any docs created before deploy (so `pre('save')` math is consistent).
   - No document rewrite of `method` or `sourceNumber` (historical rows keep empty `sourceNumber`).
2. **`scripts/party-detect-duplicates.js`** (READ-ONLY report):
   - Scans Customer↔Supplier for shared phone (normalized), taxNumber, fuzzy name.
   - Writes a report file (JSON/CSV) only — **no linking**. Human/reviewer uses it to drive explicit links.
3. **`scripts/party-link.js`** (OPTIONAL, explicit):
   - Only runs for a provided list of `{customerId, supplierId}` pairs confirmed by a user. Sets mutual links.
   - Idempotent; skips already-linked.

## 05.3 — Indexes / Constraints

- `treasurytransactions`: add `{ method:1, date:-1 }`.
- `customers`: add sparse unique on `linkedSupplier`; index `taxNumber`.
- `suppliers`: add sparse unique on `linkedCustomer`.
- Keep existing unique indexes (`phone`, `receiptNumber`, Debt partial unique) untouched.

## 05.4 — Backward Compatibility

- Existing sales/purchases/collections/payments/treasury txns remain valid (no `sourceNumber` required retroactively).
- `TreasuryBalance` single doc untouched → balances unchanged.
- Existing `wallet`/`bank` transactions without `sourceNumber` continue to be valid (rule applies to NEW txns only).
- UI older clients (if any) sending no `sourceNumber` for cash → accepted (optional field).

## 05.5 — Rollback

- All changes are additive → rollback = deploy previous backend version. New fields become orphaned (harmless).
- If `linkedSupplier`/`linkedCustomer` were populated, dropping the fields is a one-line `updateMany` to `$unset`;
  no financial data lost (balances live on native collections).
- No destructive data migration performed → rollback trivial.

## 05.6 — Integrity Checks (post-deploy)

- Reconcile `TreasuryBalance.balance` against `sum(INCOME)-sum(EXPENSE)` over `treasurytransactions` (the existing
  `_rebuildBalance` path) → must match within epsilon.
- For each `cashboxdailies` doc, `closingInstapayBalance == openingInstapayBalance + instapayIncome - instapayExpenses`.
- Spot-check 10 random instapay transactions → `sourceNumber` present and non-empty (new-txn enforcement works).
- Party net-position for 5 linked entities = sum of the two native balances (no double count).
- Run existing test suite (Vitest) + backend smoke (health endpoint).

## 05.7 — Production Safety Procedure (see `FINAL-IMPLEMENTATION-PLAN.md` §Production Safety)

Backup → dry-run migration scripts (report only) → deploy backend (additive) → deploy frontend → verify integrity
checks → monitor. No data deletion at any step.
