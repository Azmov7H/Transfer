# 01 — Current-State Audit

Complete inventory of the frontend as inspected. This is the factual baseline; proposals live in later documents.

## 1. Route Map (35 pages)

### Public
| Route | Purpose |
|---|---|
| `/login` | Auth entry (Google OAuth + credentials) |

### Protected — core
| Route | Notes |
|---|---|
| `/` | Dashboard: quick actions, 4 KPIs, revenue chart, "توصيات ذكية" suggestions, low-stock alerts, recent invoices |
| `/invoices` | List with search + cash/credit filter tabs, card/list items (`InvoiceListItem`) |
| `/invoices/new` | POS-style creation page: customer select, items manager, payment section, shortage dialog |
| `/invoices/[id]` | Invoice detail + print view |
| `/customers` | **God surface**: list + details dialog + edit/add + debts + payments + installments + partner transactions |
| `/customers/[id]` | Detail page (thin wrapper over `CustomerClient`) |
| `/suppliers` | Suppliers + `SupplierDebtManager` dialog |
| `/sales-returns` | Returns list/processing |
| `/financial` | Treasury stats, transactions table, `AddTransactionDialog` |
| `/financial/debt-center` | Debtor/debt tables + payments |
| `/financial/debt-center/[id]` | Debt detail |
| `/financial/receipts/[id]` | Receipt print view |
| `/daily-sales` | Daily sales report (not in sidebar) |
| `/reports/{sales,financial,profit-by-customer,price-history,shortage}` | 5 report pages (not in sidebar) |
| `/accounting` | Accounting view (not in sidebar) |

### Protected — operations `(operations)`
`/products`, `/stock`, `/stock-movements`

### Protected — finance group `(finance)`
`/receivables` (**not in sidebar**)

### Protected — analytics
`/analytics/stock` (**not in sidebar**)

### Admin `(admin)`
`/users`, `/settings`, `/audit`, `/logs`

## 2. Navigation

- Sidebar config: 4 groups / 14 items (`src/config/navigation.js`). Role-filtered via permissions.
- Gaps: pages listed above are reachable only via deep links or embedded buttons → users cannot discover them.
- Icon reuse: `Users` icon on 3 different destinations (customers, suppliers, users).
- Header (`Header.jsx`): global search input (decorative scope unclear), notification bell → sidebar drawer, theme toggle, profile dropdown.

## 3. Design Tokens

- shadcn/HSL semantic tokens defined in `globals.css` for light+dark incl. `success/warning/info`.
- Tailwind maps them correctly.
- **Bypassed ~1,100 times** by hardcoded palette utilities: emerald (99 text + 82 bg), amber (92+77), slate, rose, red, blue, purple, green, indigo, orange, gray, pink.
- Dark mode changes primary hue navy→purple and secondary amber→blue: brand discontinuity between modes.
- Gradients: `--gradient-primary/success` + ad-hoc gradient classes ×142 combined w/ glass/blur effects.

## 4. Typography

- Fonts: Cairo (+ Tajawal fallback) via next/font — good Arabic choice.
- Weights: font-black ×582, font-bold ×495, font-semibold ×30 → hierarchy by weight is impossible when everything is heavy.
- Sizes: standard scale used, but also 210 arbitrary pixel sizes: `[10px]`×147, `[9px]`×28, `[8px]`×15, `[11px]`×14 — below comfortable reading size, inconsistent, unscalable.
- Page titles: mix of inline `text-2xl/3xl/4xl` and `PageHeader`'s `text-4xl md:text-5xl` gradient style.

## 5. Components Inventory

### UI kit (`src/components/ui/`)
button, badge, card, table, responsive-table, dialog, alert-dialog, sheet, tabs, select, checkbox, switch, input, textarea, label, field, popover, dropdown-menu, command, pagination, skeleton, spinner, tooltip, avatar, scroll-area, separator, chart(+chart-area-step), navigation-menu, smart-combobox, confirm-dialog, StatCard, PageHeader, page-components.

### Feature components (selected hotspots)
- `financial/`: **12 files**, of which **5 payment-ish dialogs**: PaymentDialog, UnifiedPaymentDialog, InvoicePaymentDialog, InstallmentDialog, AddTransactionDialog (+DebtEditDialog, TransactionDetailsDialog). Tables: TransactionsTable, DebtorTable, DebtTable. StatsCards.
- `notifications/`: 7 components; Popover & Sidebar variants unused (0 importers); both "Smart" and "Lazy" centers exist.
- `dashboard/`: KPICard, RevenueChart(+Content), LowStockTable.
- `invoices/`: CustomerSelect, ItemsManager, ListItem, PrintView, ReturnDialog.
- `common/`: LoadingState, ErrorState, EmptyState, ExportButton (content-state primitives from prior program).

## 6. Forms
- Pattern A (rare): react-hook-form via dependency-free zodResolver shim — `CustomerFormDialog`, `ProductFormDialog`.
- Pattern B (dominant): hand-rolled `useState` per field + manual validation JSX + toast feedback. No shared field layout, label/error placement varies per file.

## 7. Tables
- `ResponsiveTable` primitive exists (desktop table ↔ mobile cards) but adopted by only 4 surfaces.
- 15+ custom `<table>` implementations (TransactionsTable, DebtorTable, DebtTable, CountItemsTable, LowStockTable, users, audit, logs, suppliers, physical-inventory, purchase-orders ×2, daily-sales, CustomerClient…). Column counts range 5–12; row actions vary between icon buttons, dropdowns, and inline text links; pagination present on some lists only; filters vary (search box, tab chips, selects).

## 8. Overlays
- 25 files render DialogContent; nested flows exist (e.g., invoice creation → shortage report dialog; customers → payment → installment chains).
- Large forms live inside dialogs (customer form, product form, supplier debt manager, installments schedule).
- Destructive confirmations standardized via ConfirmDialog (good — keep).

## 9. States
- Content-state primitives (Loading/Error/Empty) exist and were rolled out in a previous program — adoption good on list pages, but dashboards/reports use bespoke skeletons and some inline spinners remain.

## 10. Accessibility
- Prior program added ~78 aria-labels across 45 files, focus-visible rings via token `--ring`, ≥44px touch targets on row actions, semantic tables.
- Remaining gaps: micro-font sizes, color-only status meaning in several badges/charts, decorative animations not respecting reduced-motion, heading order violations on decorated pages (h1 gradient + h2/h3 skips), dialog focus traps OK (Radix) but nested-dialog focus return needs verification.

## 11. Responsive
- Sidebar: mobile drawer + desktop collapse — solid.
- ResponsiveTable handles mobile transformation only where adopted.
- Dashboard grid collapses properly; reports use fixed-width containers in places; print views (invoice, receipt) have dedicated print layouts.

## 12. RTL
- App is RTL-first (dir=rtl at root and per-page). Known rough edges: numeric/LTR fragments inside RTL sentences (invoice numbers, phone numbers) occasionally mis-punctuate; logical-property usage mostly correct after earlier sprints; charts axis labels Arabic rendering OK (recharts).
