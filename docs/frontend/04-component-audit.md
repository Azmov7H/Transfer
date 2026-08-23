# 04 — Component Audit

## Inventory

~90 components: 33 shadcn `ui/` primitives, ~55 feature components, plus root-level `Header.jsx`, `Sidebar.jsx`, `ErrorBoundary.jsx`, `theme-provider.jsx`.

## Key Findings

### COMP-001 — Triplicated Product Selector (MEDIUM)
| Component | Used by |
|---|---|
| `invoices/ProductSelectorModal.jsx` (192 ln) | `InvoiceItemsManager.jsx:13` |
| `products/ProductSelectorDialog.jsx` | `stock/StockMovementDialog.jsx:11` |
| `products/QuickAddProductDialog.jsx` | `(operations)/…/purchase-orders/page.jsx:18` |

Three implementations of "search products → pick one" with divergent search UX, loading states, and keyboard behavior. Remediation FE-COMP-001.

### COMP-002 — Dead Components (MEDIUM)
Verified zero importers across `src/`:
- `components/ThemeToggle.jsx`
- `components/themes/Toggle.jsx` (the live header uses its own inline toggle via `useHeader`)
- `components/ErrorBoundary.jsx` — **not dead by design; it was never mounted** (see ERR-001)
- `components/Logo/Logo.jsx` — VERIFY (directory-cased path suggests manual creation; confirm no dynamic usage before deletion)

### COMP-003 — God Components (HIGH, tied to ARCH-001)
Beyond the five god pages: `suppliers/SupplierDebtManager.jsx` (522), `notifications/SmartNotificationCenter.jsx` (379), `invoices/InvoiceItemsManager.jsx` (346). Each mixes data orchestration with presentation and at least two concerns more. Remediation inside Sprint 05 page decompositions.

### COMP-004 — Sidebar Stack Layering (LOW)
Live chain is `Sidebar.jsx` → `sidebar/SidebarGroup.jsx` + `sidebar/SidebarItem.jsx`; shadcn `ui/sidebar.jsx` (682 ln) exists but is only partially related boilerplate. VERIFY whether `ui/sidebar.jsx` exports are consumed; if not, it's a large dead file for Sprint 10.

### COMP-005 — Notification Component Fan-Out (LOW)
6 components + context + hook for notifications. Only entry point used externally. Consolidation candidate after Sprint 02 polling fixes (behavior first, structure second).

### COMP-006 — Common State Primitives Exist but Are Under-Applied (MEDIUM)
`common/LoadingState.jsx`, `common/ErrorState.jsx`, `ui/skeleton.jsx` exist; adoption is inconsistent — several pages render bespoke spinners (`Loader2` inline) or nothing during load. Empty states are ad-hoc per table. Remediation FE-COMP-002 / FE-PAGES-005.

## Component Hygiene Observations

- Props drilling is limited; providers cover sidebar/notifications/theme. No runaway context found.
- `ExportButton.jsx` statically imports jsPDF + autotable (PERF-001) and is used on exactly one page (users) — good isolation for lazy-loading.
- Print flows: four pages call bare `window.print()` (acceptable with print CSS); `PartnerTransactionDialog.jsx:39-43` swaps `document.body.innerHTML` and force-reloads (SEC-002).
