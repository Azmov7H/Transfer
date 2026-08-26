# 10 — Tables UX Standard

## Problem
1. `ResponsiveTable` primitive exists but only 4 surfaces use it; 15+ bespoke `<table>` implementations each define their own header styles, row hover, action placement, pagination and empty states.
2. Column overload on financial tables (DebtTable/DebtorTable/TransactionsTable up to ~10-12 columns) with equal visual weight — no column priority.
3. Row actions inconsistent: some icon buttons, some dropdown, some text links; destructive actions not consistently behind ConfirmDialog.
4. Filters: search + tab chips (invoices), bare selects (some reports), none (audit) — three paradigms.
5. Status cells are raw colored text/badges with per-feature color meanings.
6. Pagination present on some lists only; others render unbounded rows.

## Current Behavior
`ui/table.jsx` + `ui/responsive-table.jsx` primitives exist; data comes from React Query hooks with existing filters/pagination params where implemented.

## Proposed Standard

### Anatomy (all list tables)
```
PageHeader (title + count badge)          [primary: create action]
Toolbar: [Search input] [Filter chips/selects] …… [Export] [Column visibility (opt)]
Table: sticky header; sortable columns marked w/ aria-sort; numeric columns tabular + left-aligned(LTR);
       status via StatusBadge; row primary action = open detail (whole-row click or first-cell link)
Row actions: ≤3 visible icons (open/edit/delete-or-primary-financial-action); rest in ⋯ dropdown
Footer: pagination (existing component) + "عرض X من Y" summary
Empty: EmptyState primitive w/ contextual hint
Loading: skeleton rows (existing pattern)
```

### Mobile transformation (via ResponsiveTable)
Card per row: title line = entity name/number; meta line = status badge + date; amounts emphasized; primary action button + ⋯ menu. Config-driven column mapping (primary/meta/amounts/actions) — no per-page custom cards.

### Column priority template per key table
| Table | Always visible | Secondary (desktop-xl / dropdown) |
|---|---|---|
| Invoices | رقم، العميل، التاريخ، الإجمالي، الحالة | نوع الدفع، طريقة التسليم |
| Customers | الاسم، الهاتف، الرصيد، الحالة | العنوان، سعر الشراء المفضل، آخر تعامل |
| Debts/Debtors | الطرف، المبلغ المستحق، تاريخ الاستحقاق، الحالة | المصدر (فاتورة/قسط)، ملاحظات |
| Transactions | التاريخ، البيان، وارد/منصرف، الرصيد | المرجع، المستخدم |
| Products | الاسم، الكود، سعر البيع، المخزون | الأسعار الأخرى، الحد الأدنى |

**No business data removed** — secondary columns remain accessible (horizontal scroll on xl, column toggle, and mobile card includes top-4 fields).

### Filters standard
Search debounced (existing hooks already debounce where present). Filter chips for ≤3 enum options (keep invoice cash/credit pattern as canonical). Select dropdowns beyond that. Date-range picker shared component for reports.

## Business Logic Preservation
Query keys, filter params, sorting params unchanged. Row-click navigation targets unchanged. ConfirmDialog reuse keeps destructive flows identical.

## Components Affected
`ui/responsive-table.jsx` (extend config API), `ui/table.jsx`, all table components listed in audit §7, page-level toolbars.

## Dependencies
StatusBadge (design-system doc), color tokens, typography scale, EmptyState/ErrorState (exist).

## Risks
Medium — widest-touch workstream. Mitigation: migrate one feature at a time starting with invoices (canonical example), keep old tables functional until their turn; snapshot tests for ResponsiveTable config API.

## Acceptance Criteria
Per migrated table:
1. All previous columns/data reachable (visible, scrollable, or toggled).
2. Filters/sorting/pagination behavior identical.
3. Mobile card view verified on 375px width.
4. Empty/loading/error states from primitives.
5. Row actions: ≤3 visible + menu; destructive behind ConfirmDialog.

## Priority: P1 · Complexity: L

---

## Tasks
| ID | Task | Pri |
|---|---|---|
| UX-070 | Extend ResponsiveTable API (column priority, card mapping, toolbar slots) | P1 |
| UX-071 | StatusBadge component w/ global meaning contract | P1 |
| UX-072 | Migrate invoices list (canonical) | P1 |
| UX-073 | Migrate customers list | P1 |
| UX-074 | Migrate financial trio (Transactions/Debt/Debtor tables) | P1 |
| UX-075 | Migrate products/suppliers/purchase-orders | P2 |
| UX-076 | Migrate admin tables (users/audit/logs) to compact tier | P2 |
| UX-077 | Shared DateRangePicker + report toolbar kit | P2 |
| UX-078 | Physical-inventory & stock-movement tables migration | P3 |
