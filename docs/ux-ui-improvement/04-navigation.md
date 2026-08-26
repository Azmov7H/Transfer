# 04 — Navigation Redesign Plan

## Problem
1. 8+ routes unreachable from sidebar (reports ×5, accounting, receivables, analytics/stock, daily-sales).
2. Icon reuse (`Users` ×3) breaks wayfinding.
3. No "where am I" reinforcement beyond item highlighting (no breadcrumbs, no page-context in header).
4. Header search scope unclear (decorative); notification + theme + profile cluster ungrouped.

## Current Behavior
`src/config/navigation.js`: 4 groups / 14 items; `useSidebarLogic` filters by permission and renders groups. Header renders search, bell, theme, avatar dropdown.

## Proposed UX/UI

### Sidebar hierarchy (post-IA)
```
الرئيسية
  لوحة التحكم            /
المبيعات
  فاتورة جديدة           /invoices/new      [primary action styling]
  سجل الفواتير           /invoices
  مرتجع المبيعات          /sales-returns
  العملاء                /customers
المخزون والمشتريات
  المنتجات               /products
  المخزون الحالي          /stock
  سجل حركة المخزون        /stock-movements
  الجرد الفعلي            /physical-inventory
  أوامر الشراء            /purchase-orders
  الموردين               /suppliers
المالية
  الخزينة والحركات        /financial
  الديون والمستحقات       /financial/debt-center
التقارير
  التقارير المالية        /reports/financial
  تقرير المبيعات          /reports/sales
  أرباح العملاء           /reports/profit-by-customer
  تاريخ الأسعار           /reports/price-history
  النواقص                 /reports/shortage
النظام
  المستخدمين             /users
  الإعدادات              /settings
```
- Distinct icons per destination (customers=Contact/Users-round, suppliers=Truck, users=UserCog, stock=Boxes vs movements=ArrowLeftRight vs analytics=ChartBar…).
- "فاتورة جديدة" rendered as the single accent-colored item (primary CTA of the whole app).
- Group titles: muted caption style (see typography doc), items regular weight — fixes all-bold noise.
- Active state: filled background token `bg-accent text-primary` + start-edge indicator bar (RTL-aware), not color-only.

### Wayfinding additions
- **PageHeader breadcrumb slot** on detail pages only (فواتیر / #1234; العملاء / أحمد): 2 levels max.
- Header shows current section name on mobile (replaces hidden sidebar context).

### Header simplification
- Keep: notification bell, profile dropdown, theme toggle (move into profile dropdown to reduce top-bar items from 4→3).
- Search input: either wire to a real global command palette (products/customers/invoices via existing query hooks) or hide until implemented — decorative search erodes trust. Decision recorded as task UX-014 with two variants; default = command palette using existing services only.

## Business Logic Preservation
Permission filtering logic (`filteredNavigation`, ROLES gating) is untouched; only config data, icons, labels and presentation change. Route paths unchanged except none.

## Components Affected
`navigation.js`, `Sidebar.jsx`, `sidebar/SidebarItem.jsx`, `SidebarGroup.jsx`, `useSidebarLogic.js`, `Header.jsx`.

## Dependencies
Typography tokens (06) for group-caption styles; color tokens (05) for active state.

## Risks
- Role-gated items must keep exact permission mapping (regression: matrix test exists for permissions lib; add nav-config snapshot test).
- Arabic label changes are copy changes — reviewed verbatim list required before implementation.

## Acceptance Criteria
1. Every route reachable by some role appears in nav or is linked from a hub page.
2. No icon used for two destinations.
3. Permission filtering behavior identical (snapshot test green).
4. Keyboard navigation through sidebar preserved; active state not color-only (indicator + aria-current).

## Priority: P1 · Complexity: M

---

## Tasks
| ID | Task | Files | Pri |
|---|---|---|---|
| UX-010 | Rewrite navigationConfig (groups/labels/icons per above) | config/navigation.js | P1 |
| UX-011 | Sidebar visual pass: active indicator, group captions, CTA item | Sidebar*, useSidebarLogic | P1 |
| UX-012 | Header decluster: theme into profile menu | Header.jsx | P2 |
| UX-013 | Breadcrumb slot in PageHeader for detail pages | ui/PageHeader.jsx | P2 |
| UX-014 | Global search decision: implement command palette over existing services OR remove input | Header, new CommandPalette | P2 |
| UX-015 | Nav snapshot tests for role filtering | __tests__ | P2 |
