# Financial Architecture (as-built)

This documents how money moves today. All treasury writes go through `TreasuryService`
(`be-Jammaz/services/treasuryService.js`), which is the **single choke point**.

## Core Entities

- **TreasuryTransaction** — the canonical financial movement record. Has `type` (INCOME/EXPENSE),
  `amount`, `method`, `referenceType`/`referenceId`, `partnerId`, `receiptNumber`, `createdBy`.
- **TreasuryBalance** — one fixed doc; running net balance. Bumped atomically by
  `_applyBalanceDelta` inside `_createTransactions` (session-scoped).
- **CashboxDaily** — per calendar day; tracks income/expense split by method (cash/bank/wallet/check)
  plus manual entries and reconciliation.
- **Debt** — polymorphic receivable/payable (Customer or Supplier debtor).
- **AccountingEntry** — GL double-entry (debitAccount/creditAccount).

## Payment Channels Today

`TreasuryTransaction.method` ∈ `['cash','bank','wallet','check','adjustment']`:
- `cash` → **Private / Main Cash Treasury** (primary physical cashbox)
- `bank` → bank transfer
- `wallet` → **Cash Wallet** (UI: "محفظة", "محفظة كاش", "محفظة إلكترونية")
- `check` → checks
- `adjustment` → internal adjustment (note: missing from Zod `paymentMethod` enum)

**InstaPay is not represented.**

## Treasury Write Paths (all via TreasuryService)

| Business event | Method | Service call | Treasury effect |
|---------------|--------|--------------|-----------------|
| Sale income | `invoice.paymentType` | `recordSaleIncome` | INCOME + cashbox method field + balance bump |
| Customer collection (invoice) | passed `method` | `recordPaymentCollection` → `_recordCollection` | INCOME + method field |
| Unified collection (total) | passed `method` | `recordUnifiedCollection` → `_recordCollection` | INCOME + method field |
| Supplier payment | passed `method` | `recordSupplierPayment` | EXPENSE + method field |
| Manual debt payment | passed `method` | `recordDebtTransaction` | INCOME/EXPENSE + method field |
| Purchase expense | `po.paymentType` (credit→no movement) | `recordPurchaseExpense` | EXPENSE + method field |
| Sales return refund | `salesReturn.refundMethod` | `recordReturnRefund` | EXPENSE (−income field) |
| Manual income/expense | passed `method` | `addManualIncome`/`addManualExpense` | INCOME/EXPENSE + method field |
| Undo | — | `undoTransaction` / `deleteTransactionByRef` | reverses balance + cashbox |

Each path also updates `CashboxDaily` via `updateDailyCashbox` using a `method`→field map, e.g.:
```
method==='bank'  ? 'bankIncome'/'bankExpenses'
method==='wallet'? 'walletIncome'/'walletExpenses'
method==='check' ? 'checkIncome'/'checkExpenses'
else             ? 'salesIncome'/'purchaseExpenses'   (cash)
```
**To add `instapay`, this map must gain `instapayIncome`/`instapayExpenses` (or reuse a generic
"electronic" bucket) in `CashboxDaily` + `TreasuryService` + `TreasuryBalance` breakdown aggregation.**

## Balance Calculation

- `TreasuryBalance` is the live running total (INCOME−EXPENSE).
- `getSummary` aggregates `TreasuryTransaction` by `method` to produce `breakdown.{cash,bank,wallet,check}`
  (`treasuryService.js:614`). **`instapay` must be added to the breakdown initializer & branch.**
- `TreasuryStatsCards.jsx` (frontend) renders `breakdown.cash/bank/wallet` — would need `instapay`.

## Validation of Payment Method (current)

- `validators.js:26`: `paymentMethod = z.enum(['cash','bank','wallet','check']).optional()`
  (omits `adjustment` and `instapay`).
- `invoiceSchema.paymentType`: `enum['cash','credit','bank','wallet','check']`.
- `purchaseOrderSchema.paymentType`: `enum['cash','bank','credit','wallet','check']`.
- Route-level `payBody` in `customerRoutes.js:15`: `enum['cash','bank','wallet','check']`.
- `customerPaymentSchema`, `supplierPaymentSchema`, `debtPaymentSchema`, `counterpartyPaymentSchema`,
  `expenseSchema`, `treasuryTransactionSchema` all use `paymentMethod`.

## Source / Transfer Number (current)

**None.** There is no field capturing the sender's InstaPay/Wallet account or transfer reference on:
- `TreasuryTransaction`
- `Invoice.payments[]`
- any validation schema
- any service call

This is the central gap for requirement #2.

## Debt / Collection Flow

1. Sale on credit → `DebtService.createDebt(debtorType:'Customer', …)` (`saleService.recordSale`).
2. Collection → `PaymentService.recordCustomerPayment` → `invoice.recordPayment` (atomic pipeline) +
   `DebtService.updateBalance` + `TreasuryService.recordPaymentCollection` + schedule update.
3. Unified collection → `recordTotalCustomerPayment` loops active debts, applies payments, then
   `recordUnifiedCollection`.
4. Manual debt payment (Customer or Supplier) → `recordManualDebtPayment` → `recordDebtTransaction`.
5. Supplier payment → `recordSupplierPayment` → `recordSupplierPayment` (treasury EXPENSE) +
   supplier balance decrement.

All wrapped in `withTransaction`+`withRetry` (T-BIZ-01).

## Double-Entry / GL

`AccountingService` writes `AccountingEntry`s. **Exact account codes/names are UNKNOWN from the slices
read — must be confirmed in `services/accountingService.js` during implementation (see traceability
REQ-ACC-*).** Any new channel should post to consistent GL accounts.

## Weaknesses (for the plan)

1. No `instapay` channel → cannot record InstaPay settlements or isolate them in balances.
2. No source/transfer number → no audit trail for electronic transfers (fraud/traceability risk).
3. `method` enum drift between model (`adjustment`) and Zod (`paymentMethod` omits it).
4. Single treasury balance; per-channel *balances* are derived, not stored — adding per-channel
   running balances (optional) is a design decision (see `02-architecture/proposed-treasury-architecture.md`).
5. `CashboxDaily` method-field map is hardcoded in multiple `TreasuryService` methods → must be
   centralized before adding `instapay`.
