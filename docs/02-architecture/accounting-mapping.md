# Accounting / GL Account Mapping (FIN-SVC-005)

> Resolves the "GL account unknowns" risk flagged in Sprint 1. Read-only investigation of
> `be-Jammaz/services/accountingService.js` (the single place that maps payment methods to
> GL accounts). No logic was changed here beyond adding the new `INSTAPAY` account constant.

## Chart of Accounts (`ACCOUNTS`, `accountingService.js`)

| Key | Arabic label | Role |
|-----|--------------|------|
| `CASH` | الخزينة / النقدية | Cash / Private Treasury |
| `BANK` | البنك / الحساب البنكي | Bank |
| `WALLET` | محفظة كاش | Cash Wallet |
| `INSTAPAY` | انستا باي | **NEW** InstaPay channel (added S1) |
| `INVENTORY` | المخزون | Inventory |
| `RECEIVABLES` | ذمم العملاء / المدينون | Customer receivables |
| `PAYABLES` | ذمم الموردين / الدائنون | Supplier payables |
| `SALES_REVENUE` | إيرادات المبيعات | Sales revenue |
| `COGS` | تكلفة البضاعة المباعة | Cost of goods sold |
| `OTHER_INCOME` / `OTHER_EXPENSE` / `RENT_EXPENSE` / `UTILITIES_EXPENSE` / `SALARIES_EXPENSE` / `SUPPLIES_EXPENSE` / `SHORTAGE_EXPENSE` / `SURPLUS_INCOME` / `SALES_RETURNS` | — | P&L accounts |

## Method → GL account mapping (as implemented today)

Extracted from `accountingService.js`:

| Method | Sale (`createSaleEntries`) | Payment collection (`createPaymentEntries`) | Purchase (`createPurchaseEntries`) | Supplier payment (`createSupplierPaymentEntries`) |
|--------|----------------------------|---------------------------------------------|------------------------------------|--------------------------------------------------|
| `cash` | `CASH` | `CASH` | `CASH` | `CASH` |
| `bank` / `bank_transfer` | `BANK` | `BANK` | `BANK` | `BANK` |
| `wallet` / `cash_wallet` | `CASH` ⚠️ | `WALLET` | `WALLET` | `WALLET` |
| `credit` | `RECEIVABLES` | — | `PAYABLES` | — |
| `instapay` | **`CASH` ⚠️ (TODO S2)** | **`INSTAPAY` (wire in S2)** | **`INSTAPAY` (wire in S4/S6)** | **`INSTAPAY` (wire in S6)** |
| `check` | `CASH` ⚠️ | — | `CASH` ⚠️ | — |

⚠️ **Drift to fix in later sprints:** today `wallet` sales and `check`/`instapay` sales still post
to `CASH` rather than their dedicated accounts. The `INSTAPAY` account constant now exists (S1) so
Sprint 2/4/6 can route `instapay` transactions to `ACCOUNTS.INSTAPAY` in the corresponding
`create*Entries` functions without a schema migration.

## Treasury transactions

`TreasuryTransaction` is the cash ledger itself (single aggregated `TreasuryBalance` +
per-day `CashboxDaily` breakdown). It does **not** generate separate `AccountingEntry` rows in the
current code path; the double-entry `AccountingEntry` records are produced by `AccountingService`
for sales/purchases/payments. The recommended target (02-architecture) keeps this and adds the
`instapay` channel to the `method` enum + `CashboxDaily` breakdown (done in S1).
