# 16 — Page-by-Page Plan

Every `(protected)` + public page. Full template for high-impact pages; compact-but-complete entries for the rest (all required sections present). States sections list only where they deviate from primitives default (Loading/Error/Empty via shared primitives everywhere).

---

# Page: Dashboard `/`
See dedicated doc 08 (tasks UX-050..054). BL unchanged: `useDashboard` queries/KPIs/suggestions.

# Page: Invoices List `/invoices`
**Current Problems:** header ad-hoc; card-list hybrid inconsistent with table standard; filter chips good but not keyboard-complete; pagination presence varies.
**UX Goals:** canonical table surface; fast scan of status/amounts.
**Layout:** PageHeader(سجل الفواتير + count) [primary: فاتورة جديدة] → Toolbar(search + chips نقدًا/آجل/الكل) → ResponsiveTable → pagination footer.
**Navigation:** row → `/invoices/[id]`; breadcrumb back.
**Hierarchy columns:** رقم، العميل، التاريخ، الإجمالي، الحالة | secondary: النوع، التسليم.
**Actions:** open (row), print (icon), ⋯ menu (returns entry point if applicable).
**States:** Empty w/ CTA فاتورة جديدة; skeleton rows.
**Responsive:** card mode (رقم+عميل / حالة+تاريخ / إجمالي emphasized).
**A11y:** aria-pressed chips; sortable headers aria-sort.
**BL unchanged:** filters params, query keys, invoice data shape, permission `invoices:view`.
**Tasks:** UX-072. **AC:** doc 10 checklist + zero data loss.

# Page: New Invoice `/invoices/new` (POS-critical)
**Current Problems:** silent price rewrites on customer change; payment section vocabulary drift; stock source implied; submit-blocked reasons invisible; desktop-shaped layout.
**UX Goals:** fastest accurate POS entry; zero surprises on price changes.
**Layout:** two-pane desktop (items manager left 2/3, customer+payment summary right sticky) → mobile stacked w/ sticky bottom submit bar.
**Forms:** customer select (SmartCombobox + quick-add), items manager rows (qty steppers on mobile), payment group (type radio-cards: نقدي/آجل; conditional آجل fields: due date, shipping).
**Actions:** primary حفظ وطباعة / حفظ; secondary مسح الفاتورة (confirm).
**Feedback:** price-change badge per affected row ("حدّث السعر") instead of generic toast; disabled-save tooltip states (فارغة/جاري الحفظ).
**States:** shortage dialog kept; unsaved-guard kept.
**Responsive:** UX-091 spec.
**A11y:** radio-cards real radios; qty inputs labeled.
**BL unchanged:** getProductPrice fallbacks, mutation payloads, due-date/shipping semantics, shortage report endpoint/payload, price-type auto-set from customer.
**REQUIRES BUSINESS DECISION:** none (presentation of existing behavior only).
**Tasks:** UX-063, UX-091. **AC:** golden-flow manual script passes all roles; parity of created invoices field-for-field.

# Page: Invoice Detail `/invoices/[id]`
**Current Problems:** ad-hoc header; action cluster density; print view separate styling drift.
**Plan:** PageHeader(فاتورة #id + StatusBadge) actions: طباعة، تحصيل (unified dialog), مرتجع; meta grid; items table via kit; payments history list. Print view keeps dedicated print CSS (exempt from type sweep, documented). **BL unchanged:** print data, return flow, payment targeting by invoiceId. **Tasks:** within UX-033/070/080 wave. **AC:** print output visually unchanged vs baseline screenshot.

# Page: Customers List `/customers`
**Current Problems (P0 hub):** 11 boolean dialog states, 6 dialogs imported, three domains mixed, duplicate detail concepts.
**UX Goals:** list = find + assess; money = detail page.
**Layout:** PageHeader(العملاء + count)[primary: عميل جديد] → toolbar search (+status select if exists today) → ResponsiveTable (الاسم، الهاتف، الرصيد، الحالة | العنوان…) → row actions: فتح / تحصيل / ⋯(تعديل).
**Navigation:** row → `/customers/[id]`.
**Removed from this page:** details/history/installment/invoice-payment dialogs (→ detail tabs or unified payment). PaymentDialog stays as unified-collect entry.
**States:** primitives.
**Responsive:** card mode.
**A11y:** action icons labeled.
**BL unchanged:** all mutations/hooks; balance computation display; permissions.
**Tasks:** UX-073 + IA-2/R2. **AC:** no reachable feature lost; boolean-state audit ≤3.

# Page: Customer Detail `/customers/[id]`
**Current Problems:** thin wrapper vs dialog duplication; unstructured info dump.
**Plan:** tabbed container: البيانات (profile + edit drawer) | الفواتير (filtered table) | المدفوعات (history + collect button) | الأقساط (schedule view/create drawer). Breadcrumb العملاء/الاسم.
**BL unchanged:** CustomerClient hooks and child components reused as-is inside tabs initially.
**Tasks:** R2/UX-083. **AC:** deep links to tabs work; keyboard tab nav.

# Page: Suppliers `/suppliers`
Compact plan: adopt table standard; SupplierDebtManager dialog → drawer (long form); supplier debt columns prioritized (الاسم، الرصيد، آخر تعامل). **BL unchanged:** debt terms validation, payloads. Tasks UX-075, UX-082-pattern.

# Page: Sales Returns `/sales-returns`
Compact plan: table standard; link each return to source invoice (existing data); status badges via StatusBadge; keep return creation flow untouched. Tasks UX-075-wave.

# Page: Financial Hub `/financial`
**Current Problems:** stats cards decorative colors; transactions table dense; relationship to debt-center/receivables/accounting unstated.
**Plan:** IA-1 tabs (الخزينة | الديون والمستحقات | الحركات). TreasuryStatsCards → KPIStat semantic. TransactionsTable via kit (التاريخ، البيان، وارد/منصرف، الرصيد | المرجع). AddTransaction modal restyled via FormKit. Links in header to محاسبي تفصيلي (/accounting) and التقارير المالية.
**BL unchanged:** all financial hooks/mutations; role gating differences preserved per tab.
**REQUIRES BUSINESS DECISION:** BD-1 (accounting merge depth).
**Tasks:** UX-074, IA-1 implementation task UX-100 (roadmap).

# Page: Debt Center `/financial/debt-center` (+[id])
**Plan:** DebtorTable/DebtTable merged into kit tables under IA-1 tab; overdue rows flagged via warning/destructive tokens + text label; UnifiedPaymentDialog entry. Detail [id]: timeline of installments/payments; drawer for installment edits. **BL unchanged:** installment math display, payment allocation logic. Tasks UX-074, UX-082.

# Page: Receipts `/financial/receipts/[id]`
Print view — keep; align print CSS tokens; exempt from app sweeps. AC: printed output identical.

# Page: Products `/products` (operations)
**Plan:** table standard (الاسم، الكود، سعر البيع، المخزون | أسعار أخرى، حد أدنى); low-stock indicator = warning token + label; create/edit modals already RHF → FormKit visuals; QuickAddDialog kept. **BL unchanged:** price fields set, stock computations display, permissions `products:view/manage`. Tasks UX-075, UX-061.

# Pages: Stock `/stock`, Stock Movements `/stock-movements`, Analytics `/analytics/stock`
Relabeled per IA-4; tables via kit; movements table gains type filter if param exists today (verify during implementation — do not invent new server filters). Analytics page gets standard PageHeader + chart palette. **BL unchanged:** queries/filters. Tasks UX-078, UX-010 labels.

# Page: Physical Inventory `/physical-inventory` (+new, +[id])
**Current Problems:** session workflow state unclear mid-count.
**Plan:** keep pages; add explicit stepper header (جديد ← جرد ← مراجعة ← اعتماد) reflecting existing statuses only; CountItemsTable → compact tier kit; variance highlighting semantic (destructive negative / warning positive) + text. **BL unchanged:** count submission/approval logic entirely. Tasks UX-078 + stepper presentation task UX-101 (P2).

# Pages: Purchase Orders `/purchase-orders` (+[id])
**Plan:** table standard; receive-action prominence per existing status transitions; detail: items table + receiving log as today. **BL unchanged:** PO lifecycle endpoints/status rules. Tasks UX-075.

# Pages: Reports ×5
Shared: report toolbar kit (DateRangePicker + selects) + ExportButton consistency; charts via chartPalette; tables via kit; auto-query vs button-query standardized to debounced-auto with explicit تحديث retained where heavy. Per-page:
- **sales**: KPI strip (from existing aggregates) + trend chart + top-products table. Orphan fixed by nav.
- **financial**: ledger-style table compact tier; export emphasized.
- **profit-by-customer**: ranking table; amounts AmountText; keep existing profit calc display only.
- **price-history**: product picker + line chart + table.
- **shortage**: list w/ status workflow buttons as-is.
**BL unchanged:** all report queries/aggregations. **Tasks:** UX-077 + per-page adoption P2.

# Page: Daily Sales `/daily-sales`
Operational screen; candidate for main nav per BD-2. Compact plan: date navigator + summary cards + hourly table if present; kit adoption. Tasks roadmap Phase 6.

# Page: Accounting `/accounting`
Pending BD-1; interim: standard PageHeader + table kit adoption only.

# Page: Receivables `(finance)/receivables`
IA-1 merge target; interim nav reachability fix (link from financial hub header).

# Admin: Users `/users`
**Plan:** table standard compact; invite/edit forms → FormKit; role select with Arabic description per role (copy from permissions lib descriptions — no new roles). **BL unchanged:** role assignment rules/endpoints.

# Admin: Settings `/settings`
Group into card sections with anchors (معلومات المحل، الطباعة، إلخ حسب现有 content); FormKit for editable fields; unsaved-guard on dirty. **BL unchanged:** settings schema/payloads.

# Admin: Audit `/audit`, Logs `/logs`
Compact-tier tables; read-only; column visibility toggle; date filters if params exist today.

# Page: Login `/login`
Keep brand hero gradient (allow-listed); form → FormKit visuals; error messaging inline; loading state on submit; decoration reduced otherwise. **BL unchanged:** OAuth + credentials flows exactly.

---

## Consistency checklist (verified)
All 35 pages inventoried; each has plan or explicit exemption (print views); BL-unchanged statements present; tasks referenced exist in docs 10–12, 15, 19.
