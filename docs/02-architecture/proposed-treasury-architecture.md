# Proposed Treasury / Payment-Channel Architecture

## Decision: Channels = the existing `method` dimension (extended)

The system already models channels as `TreasuryTransaction.method`
(`['cash','bank','wallet','check','adjustment']`) and aggregates them in `CashboxDaily` and
`TreasuryService.getSummary` (`breakdown`). **Do not introduce a parallel "Treasury accounts" collection.**
Extend the existing dimension:

| Requirement channel | `method` value | Notes |
|--------------------|---------------|-------|
| Private Treasury / Main Cash Treasury | `cash` | unchanged; default |
| Bank | `bank` | unchanged |
| Cash Wallet | `wallet` | unchanged (already "محفظة") |
| Checks | `check` | unchanged |
| **InstaPay** | **`instapay`** | **NEW** |
| Adjustment | `adjustment` | align Zod enum to include it |

## Why not separate Treasury accounts?

- The business calls these "channels"/"methods", not distinct bank accounts. A single cashbox with method
  breakdown already matches operations (daily reconciliation, running balance).
- Creating separate `Treasury` documents would require rewiring `TreasuryBalance` (single doc) and every
  balance read — high risk, low benefit.
- If future need arises for per-channel *running* balances, store them as a `Map` on `TreasuryBalance`
  (`balancesByMethod`) computed from the same ledger; this is an optimization, not a structural change.

## Required Model/Field Changes

1. `TreasuryTransaction.method` enum → add `'instapay'`.
2. `TreasuryTransaction` → add `sourceNumber: String` (optional at schema level; enforced by validation
   for `instapay`/`wallet`). Add index on `method` (already implicitly via queries; ensure compound
   `(method, date)` for reporting).
3. `CashboxDaily` → add `instapayIncome`, `instapayExpenses`, `openingInstapayBalance`,
   `closingInstapayBalance`; include in `pre('save')` totals + closing computation.
4. `TreasuryBalance` → optionally add `balancesByMethod: Map` (optimization). MVP not required.
5. `Invoice.paymentType` enum → add `'instapay'`; `Invoice.payments[].method` enum → add `'instapay'` and
   add `sourceNumber`.
6. `PurchaseOrder.paymentType` enum → add `'instapay'`.

## Centralize the Method→Cashbox Field Map

Today the map is duplicated in 9 `TreasuryService` methods. Introduce a single helper:

```js
// treasuryService.js (proposed)
const METHOD_CASHBOX = {
  cash:   { inc: 'salesIncome',      exp: 'purchaseExpenses' },
  bank:   { inc: 'bankIncome',       exp: 'bankExpenses' },
  wallet: { inc: 'walletIncome',     exp: 'walletExpenses' },
  check:  { inc: 'checkIncome',      exp: 'checkExpenses' },
  instapay:{ inc: 'instapayIncome',  exp: 'instapayExpenses' }, // NEW
};
const fieldFor = (method, type) => (type==='INCOME' ? METHOD_CASHBOX[method].inc : METHOD_CASHBOX[method].exp);
```

All write methods call `fieldFor(method, type)` instead of inline ternaries. `getSummary` breakdown
initializer adds `instapay:0`. `undoTransaction`/`deleteTransactionByRef` use the same helper.

## Validation Alignment

- `validators.js` `paymentMethod` → `z.enum(['cash','bank','wallet','check','adjustment','instapay']).optional()`.
- Add `sourceNumber` to the relevant schemas with a **conditional** rule (see `proposed-data-model.md` and
  `04-backend/validation-changes.md`).
- `invoiceSchema.paymentType` and `purchaseOrderSchema.paymentType` → add `'instapay'`.

## UI Impact

- `TreasuryStatsCards` + `financial/page.jsx` → render `breakdown.instapay` and new `CashboxDaily` instapay
  fields.
- All payment-method selectors (`PaymentDialog`, `AddTransactionDialog`, `invoices/new`, `purchase-orders/[id]`,
  `SupplierDebtManager`, `DebtEditDialog`) → add an `instapay` option via a **centralized constant**
  (e.g., `src/constants/paymentMethods.js` exporting `[{value:'cash',label:'نقدي'},...]`).
- Conditional `sourceNumber` field appears for `instapay`/`wallet`.

## Reporting Impact

- `reportingService.getFinancialReport` and any channel breakdown must include `instapay`.
- Receipts (`buildReceipt`) should display the method label including InstaPay and the (masked) source number.

## Atomicity / Consistency

No change to the all-or-nothing transaction pattern (`withTransaction`+`withRetry`). All treasury writes
still go through `_createTransactions`/`_deleteTransaction` so the running balance and cashbox stay consistent
for the new channel exactly as for existing ones.
