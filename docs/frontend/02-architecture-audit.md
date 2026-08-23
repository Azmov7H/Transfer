# 02 — Architecture Audit

## Structure Assessment

Overall folder organization is **good**: route groups mirror business domains, components are feature-scoped, hooks/services/utils are separated. The problems are inside the layers, not the layer names.

### Findings

#### ARCH-001 — God Pages (HIGH)
Five pages concentrate data fetching, multiple forms, dialogs, tables, charts, and print logic in single client files:

| File | Lines | Mixed responsibilities |
|---|---|---|
| `src/app/(protected)/financial/page.jsx` | 864 | treasury query + filters + transaction form + supplier payment dialog + print + tables + summary cards |
| `src/app/(protected)/(admin)/settings/page.jsx` | 694 | settings CRUD + tabs + forms |
| `src/app/(protected)/accounting/page.jsx` | 680 | multi-section accounting dashboard |
| `src/app/(protected)/physical-inventory/[id]/page.jsx` | 634 | detail fetch + editable line items + reconciliation |
| `src/app/(protected)/invoices/[id]/page.jsx` | 622 | invoice fetch + payments + delete + print |

Root cause: no extraction discipline; each feature grew in place. Impact: untestable units, merge conflicts, regression blast radius. Remediation: Sprint 05 tasks FE-PAGES-001…004.

#### ARCH-002 — Services Layer Bypassed (MEDIUM)
`services/**` exists as the intended API boundary, but pages import `api` directly: e.g. `financial/page.jsx:15` (`import { api } from '@/lib/api-utils'`), `useHeader.js:5`, `useUserRole.js:2`, `NotificationContext.jsx:9`. Meanwhile `useCustomers.js` etc. also skip services and call `api.get('/api/customers')` inline — so most service modules are unused pass-throughs while endpoints are string-duplicated in hooks.
Impact: no single place to see/modify an endpoint contract; URL typos possible; inconsistent error mapping.

#### ARCH-003 — Dead Backend Layer Living in Frontend (MEDIUM)
`src/lib/auth.js` (JWT signing + `next/headers`), `src/lib/cache.js`, `src/lib/cache-config.js`, `src/lib/api-response.js` are Next **server/API-route helpers for a backend that isn't in this repo**. Verified zero importers. `lib/auth.js:8` throws at import time if `JWT_SECRET` is unset — a landmine if anyone ever imports it. Remediation: FE-CLEAN-002.

#### ARCH-004 — Component Duplication Clusters (MEDIUM)
- Three near-identical product pickers, each used exactly once: `invoices/ProductSelectorModal.jsx` (InvoiceItemsManager), `products/ProductSelectorDialog.jsx` (StockMovementDialog), `products/QuickAddProductDialog.jsx` (purchase-orders page).
- Two dead theme toggles: `components/ThemeToggle.jsx`, `components/themes/Toggle.jsx` — zero importers.
- Notification stack has 6 components; only entry point `LazyNotificationCenter.jsx` is imported outside its own dir (root layout) — internal fan-out is fine but `SmartNotificationCenter.jsx` (379 lines) vs `NotificationSidebar.jsx` (240) overlap needs consolidation review (VERIFY).
Remediation: FE-COMP-001, FE-CLEAN-002.

#### ARCH-005 — Shared Primitive Fragmentation (LOW)
`components/ui/` contains both generated shadcn primitives and hand-made "shared" components with overlapping purpose: `PageHeader.jsx` vs `page-components.jsx` vs `StatCard.jsx` vs dashboard/KPICard.jsx. Multiple stat-card implementations coexist.

#### ARCH-006 — No Circular Dependencies Detected (INFO)
Import graph spot-checks found no cycles; `utils/index.js` is a clean leaf. Keep it that way via lint rule (`import/no-cycle`) once ESLint works.

## Target Architecture

See [architecture/target.md](architecture/target.md). Summary:
1. Pages = thin composition (route → server/RSC wrapper where feasible → feature views).
2. Feature views own UI state; hooks own server state; services own endpoint contracts.
3. Single shared primitive set (`ui/`), single picker/dialog per domain concept.
4. Dead backend modules removed; frontend talks only through `api-utils` fetcher.
