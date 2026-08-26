# 08 — Dashboard UX Plan

## Page: Dashboard `/` (`src/app/(protected)/page.jsx` + `components/dashboard/*`)

### Current Problems
1. **Hierarchy inversion**: "توصيات ذكية" strategy cards and decorative quick-action grid occupy prime space while operational needs (what needs action today: overdue debts, low stock, pending POs) are secondary.
2. Quick-actions duplicate the sidebar (4 tiles for destinations already one click away).
3. KPI cards show raw values with no comparison/trend context; four different accent colors per card are decorative, not semantic.
4. "تنبيهات المخزون" row button "طلب" has no visible destination logic clarity (creates what where?).
5. Recent sales list truncates names to 100px/120px — unreadable Arabic business names.
6. Decorative load: gradient H1 + pulsing icon + blur orbs + rotating hover icons.
7. Empty-state handling inconsistent with content-state primitives used elsewhere.

### UX Goals
Answer in ≤5 seconds: "ما الذي يحتاج انتباهي اليوم؟" then provide one primary action.

### Layout (proposed)
```
PageHeader (لوحة التحكم | subtitle: تاريخ اليوم)      [primary action: فاتورة جديدة]
──────────────────────────────────────────────
KPI strip (4 cards, single accent = primary; delta vs yesterday if data exists)
──────────────────────────────────────────────
[يحتاج انتباهك]  ← merged alert panel, ordered by severity
  • ديون متأخرة (count+sum → debt-center link)
  • نواقص مخزون (count → products?low=1 link)   [replaces LowStockTable rows w/ "طلب" → purchase flow entry]
  • جرد قائم/أوامر شراء بانتظار الاستلام
──────────────────────────────────────────────
[إيرادات آخر ٧ أيام] (chart, 2/3)   | [آخر الفواتير] list (1/3, full-name rows, link "عرض الكل" → /invoices)
──────────────────────────────────────────────
Optional row (collapsed by default): توصيات ذكية as dismissible list, not card grid
```

### Information hierarchy
| Level | Content |
|---|---|
| Critical | overdue debts, cash balance |
| Important | today sales/profit, stock alerts |
| Secondary | revenue chart, recent invoices |
| Optional | strategy suggestions |

### Components
KPICard (unify StatCard/KPICard), AlertPanel (new composition of existing primitives), RevenueChart (keep, restyle tokens), RecentInvoices (keep, fix truncation).

### Actions
Single primary CTA فاتورة جديدة in header. Remove quick-action tile grid (sidebar already provides nav). "طلب" on stock alert links to purchase-orders/new prefilled — **presentation of existing navigation only**.

### States
Loading: keep skeleton but align to new layout. Empty (new store): EmptyState primitive with 3-step onboarding hints (create product → create invoice → view dashboard). Error: ErrorState with retry. Success: refetch toast removed in favor of silent refresh (data freshness indicator optional).

### Responsive
Mobile: KPIs 2×2 → horizontal scroll strip; attention panel stacks; chart collapses to 7-bar minimal; recents become cards. Tablet: 2-col.

### Accessibility
H1 once; alert panel uses `role="region"` + `aria-label="يحتاج انتباهك"`; severity conveyed by text label + icon, not color alone; no auto-rotating content.

### Business Logic That Must Remain Unchanged
`useDashboard()` queries, KPI computations, suggestion generation, invoice data shape — untouched. Only arrangement/presentation. Removing quick-action tiles removes navigation shortcuts only (all destinations remain in sidebar).

### Implementation Tasks
| ID | Task | Pri |
|---|---|---|
| UX-050 | Restructure dashboard layout & remove quick-action grid | P1 |
| UX-051 | Attention panel composing existing queries (overdue from debt hooks, low-stock from dashboard hook) | P1 |
| UX-052 | KPICard semantic single-accent redesign (+delta if cheaply available; omit if requires new API → skip) | P2 |
| UX-053 | Demote توصيات ذكية to collapsible section | P2 |
| UX-054 | Fix truncation widths / row layouts in recents + alerts | P2 |

### Acceptance Criteria
1. No data removed; every previously-visible datum still reachable within one click.
2. All four roles' dashboards render correctly under existing permission gating.
3. Loading/empty/error states use shared primitives.
4. Lighthouse a11y ≥ previous score; contrast AA on new components.
