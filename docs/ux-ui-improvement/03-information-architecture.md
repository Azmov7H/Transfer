# 03 — Information Architecture (Proposed)

Routes are **not changed** in this phase. This document defines the target IA; route moves happen later under authorized implementation, and where a proposal implies URL changes each is individually gated.

Format per change: Current Structure → Problem → Proposed Structure → Reason → Business Logic Impact → Risk.

---

## IA-1 — Money surfaces consolidation (presentation-level)

- **Current:** 5 money surfaces with overlapping content: `/financial` (treasury+transactions), `/financial/debt-center` (+`[id]`), `(finance)/receivables`, `/accounting`, `/reports/financial`.
- **Problem:** users cannot form a model of where money lives; receivables & accounting unreachable from nav.
- **Proposed:** single "المالية" hub at `/financial` with tabs: الخزينة | الديون والمستحقات (merges debt-center + receivables views) | الحركات المالية. Keep existing URLs as routes; render as tabs via a layout. `/accounting` and `/reports/financial` remain separate but linked from the hub header ("عرض محاسبي تفصيلي").
- **Reason:** one mental location for money; matches J5 journey.
- **Business Logic Impact:** none — same queries, same mutations; grouping is presentational.
- **Risk:** Medium — tab layout must preserve per-tab query state and role gating differences between debt-center (financial:view) and accounting surfaces.

## IA-2 — Customers page decomposition

- **Current:** one page = list + details dialog + payments + installments + history.
- **Problem:** F2/P0 dialog hub; duplicate detail concepts (dialog vs `/customers/[id]`).
- **Proposed:** list page keeps CRUD + search + balance summary only. Everything financial moves to `/customers/[id]` detail page with tabs: البيانات | الفواتير | المدفوعات | الأقساط. Row actions on list reduce to: فتح / تحصيل / تعديل.
- **Reason:** removes overchoice; single canonical detail destination; aligns with J3.
- **Business Logic Impact:** none — same hooks/dialogs relocated.
- **Risk:** Low-Medium — deep-link behavior of currently-open-dialog states must map to detail-page tabs.

## IA-3 — Payment action unification

- **Current:** 5 dialogs selected by entry point.
- **Proposed:** one `PaymentDialog` (unified) parameterized by target entity {customer|invoice|debt|installment-plan}; entry points pass context. Old dialogs become internal variants or are deleted after parity verification.
- **Reason:** identical skill everywhere (J2); kills the top P0.
- **Business Logic Impact:** none — same mutation endpoints/payloads; field sets are the union already implemented across variants.
- **Risk:** Medium — must prove field-parity per variant before deletion; regression-test each entry point.

## IA-4 — Inventory naming & grouping

- **Current:** المنتجات، حركة المخزون (/stock)، الجرد الفعلي، أوامر الشراء، الموردين + orphan `/analytics/stock` and `/stock-movements`.
- **Problem:** three "stock-ish" destinations with unclear labels.
- **Proposed:** group stays; labels clarified: المخزون الحالي (/stock), سجل حركة المخزون (/stock-movements), تحليلات المخزون (/analytics/stock). الجرد الفعلي stays top-level within group (distinct session workflow).
- **Reason:** disambiguation without route changes.
- **Business Logic Impact:** none.
- **Risk:** Low — copy changes only.

## IA-5 — Reports discoverability

- **Current:** 5 report pages absent from navigation.
- **Proposed:** nav group "التقارير" containing التقارير المالية (/reports/financial), مبيعات (/reports/sales), أرباح العملاء (/reports/profit-by-customer), تاريخ الأسعار (/reports/price-history), النواقص (/reports/shortage). Daily sales becomes a card inside reports/sales or its own item per role usage (verify analytics during implementation).
- **Reason:** fixes discovery failure (J6/F3).
- **Business Logic Impact:** none — visibility still permission-filtered.
- **Risk:** Low.

## IA-6 — Dialog vs page vs drawer decisions (summary)

| Content | Decision | Why |
|---|---|---|
| Customer/product/supplier create+edit | Modal (short forms) | <10 fields, quick add-in-context |
| Customer full edit / multi-section forms | Drawer or dedicated section on detail page tab | long form shouldn't trap user in modal |
| Payment collection | Unified modal | focused transactional act |
| Installment schedule create/view | Drawer (wide, reviewable) | needs reading + editing side by side |
| Invoice creation | Page (keep) | POS-style, high frequency |
| Shortage report | Small modal (keep) | micro-task |
| Physical inventory counting | Page (keep) | long-running session |
| Details/history browsing | Tabs on detail pages, not modals | navigable, linkable |

## IA-7 — Primary vs secondary actions convention
Every list surface gets exactly ONE primary button (create-type) in the page header; row actions limited to ≤3 visible icons; everything else into a row dropdown (⋯). Applied per-page in doc 16.

## REQUIRES BUSINESS DECISION log (IA)
| # | Item | Question |
|---|---|---|
| BD-1 | Merge `/accounting` into financial hub? | Is accounting an owner-only distinct discipline or a finance view? |
| BD-2 | `/daily-sales` placement | Operational screen used hourly by manager? Then it belongs in main nav, not reports. |
