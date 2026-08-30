# Frontend Architecture (`Jammaz-System`)

## Structure

```
src/
├── app/(public)/login/        # Public login page
├── app/(protected)/          # All authenticated areas (layout guards via middleware)
│   ├── page.jsx              # Dashboard
│   ├── financial/            # treasury summary, expenses, debt-center, receipts
│   ├── customers/            # customer list + [id] detail (CustomerClient)
│   ├── suppliers/            # supplier list
│   ├── invoices/             # list, new, [id]
│   ├── purchase-orders/      # list, [id]
│   ├── sales-returns/        # returns list
│   ├── accounting/           # GL entries + CSV export
│   ├── reports/              # sales, shortage, profit-by-customer, price-history
│   ├── (admin)/users/        # user mgmt (uses ExportButton)
│   ├── (finance)/receivables/# receivables
│   ├── (operations)/stock/   # stock ops
│   ├── physical-inventory/   # stock counts
│   └── daily-sales/
├── components/               # Feature components (see below)
├── services/                 # API contract modules (fetch wrappers)
├── hooks/                    # React Query hooks (useFinancial, useInvoices, …)
├── validations/             # Light Zod schemas (UI-side; canonical lives in backend)
├── lib/                      # api-utils, permissions
├── config/navigation.js      # Centralized nav (permission-gated)
└── context/                  # NotificationContext
```

## State Management

- **Server state:** TanStack React Query (`@tanstack/react-query`). Hooks in `src/hooks/` wrap
  `services/*` calls (e.g. `useFinancial.js` → `useTreasury`, `useAddTransaction`, `useAddPayment`,
  `useCustomerTotalPayment`, `usePartnerTransactions`).
- **Form state:** React Hook Form + Zod (`react-hook-form`, `zod`).
- **Auth state:** JWT cookie + middleware; client reads role via `useUserRole` hook and `lib/permissions.js`.
- **Cross-cutting:** `NotificationContext` for toasts; `mutation-feedback.js` standardizes success/error
  messaging.

## Financial UI Components (`components/financial/`)

| Component | Responsibility |
|-----------|----------------|
| `TransactionsTable.jsx` | Renders `transactions` prop; shows method badge (`bank`/`wallet`/cash); per-row actions (info, delete Manual) |
| `TreasuryStatsCards.jsx` | Shows balance + `treasuryData.breakdown.{cash,bank,wallet}` |
| `AddTransactionDialog.jsx` | Manual income/expense; method `SelectItem value="wallet"` etc. (line 67) |
| `PaymentDialog.jsx` | Records payment; builds `methodOptions` incl. `'wallet'` (lines 181, 212, 279) |
| `PartnerTransactionDialog.jsx` | Partner transaction history |
| `DebtTable.jsx` / `DebtorTable.jsx` | Debt lists with collection actions |
| `InstallmentDialog.jsx`, `DebtEditDialog.jsx` | Debt management |
| `TransactionDetailsDialog.jsx` | Shows `selectedTx.method` (line 76: wallet → "محفظة إلكترونية") |

## Payment Method Presentation Today

- `TransactionsTable.jsx:127`: `tx.method === 'bank' ? 'بنك' : tx.method === 'wallet' ? 'محفظة' : 'نقدي'`
- `PaymentDialog.jsx` and `AddTransactionDialog.jsx` offer `cash/bank/wallet/check` (no `instapay`).
- Purchase-order & invoice new pages (`purchase-orders/[id]/page.jsx`, `invoices/new/page.jsx`) use
  `paymentType` toggles including `wallet` ("محفظة كاش").
- **InstaPay is absent from every UI selector.**

## Services Layer (client API contracts)

`src/services/financeService.js` is the canonical client contract for finance:
- `getTreasury(params)` → `GET /api/financial/treasury`
- `addTreasuryTransaction(data)` → `POST /api/financial/transaction`
- `addPayment(data)` → `POST /api/financial/payments`
- `payCustomerTotal(customerId, data)` → `POST /api/customers/:id/pay`
- `getPartnerTransactions(partnerId, params)` → `GET /api/financial/partner/:id/transactions`
- `getReceipt(receiptId)` → `GET /api/financial/receipts/:id`

`src/services/treasuryService.js` (legacy) hits `/api/treasury/*` (summary, daily, transactions).

## Export Components

- `components/common/ExportButton.jsx` — dropdown (Excel / PDF). **Excel → `POST /api/export`
  (no backend). PDF → client jsPDF + autotable, no Arabic font.**
- `app/(protected)/accounting/page.jsx` — `exportToCSV` (client CSV w/ UTF-8 BOM).
- `components/accounting/FiltersBar.jsx` — `onExport` callback.

## RTL / i18n

App is Arabic RTL. `globals.css` sets RTL direction. UI strings are Arabic. Export PDF must handle
Arabic (currently broken — see `export-architecture.md`).

## Known Frontend Tech Debt (relevant to this plan)

- `TransactionsTable.jsx` referenced `filteredTransactions`/`setTypeFilter` before fix; now uses props
  `transactions`/`onTypeFilterChange`. (Prior bug resolved during this analysis — no code committed.)
- `ExportButton` Excel path is dead (missing backend).
- Payment-method lists are hardcoded in multiple components → must be centralized before adding
  `instapay` (single source of truth needed).
