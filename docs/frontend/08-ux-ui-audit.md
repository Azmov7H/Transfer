# 08 — UX/UI Audit

## Visual System

- Design tokens via CSS variables + Tailwind theme (globals.css) with next-themes dark mode ✅.
- Cairo (Arabic-optimized) font with `display:swap` and system fallbacks ✅.
- shadcn primitives give consistent buttons/inputs/dialogs **where used**.

### UX-001 — Native `alert()`/`confirm()` vs Toast System Conflict (MEDIUM)
Sonner is globally mounted (`layout.jsx`), yet 10 sites use browser-native dialogs for validation errors and destructive confirmations:
`financial/page.jsx:86,104,118` · `users/page.jsx:52` · `suppliers/page.jsx:68` · `purchase-orders/page.jsx:115` · `products/page.jsx:85` · `customers/page.jsx:152` · `invoices/[id]/page.jsx:134` · `InvoiceListItem.jsx:153`.
Native dialogs: unstyled in an RTL Arabic UI, block the main thread, bypass Radix focus management — and `@radix-ui/react-alert-dialog` is already installed and unused. Remediation FE-UX-001.

### UX-002 — Inconsistent Feedback Patterns (MEDIUM)
Same operation class uses different feedback depending on page:
- Delete customer → `window.confirm` + toast; delete user → bare `confirm`; delete invoice → `confirm` with different phrasing style.
- Success toasts sometimes in hooks (`useCustomers`), sometimes in components, sometimes absent.
Remediation FE-DATA-003 + FE-UX-001.

## User Flow Issues

| Flow | Problem |
|---|---|
| Session expiry | dead ends on any page (AUTH-001) |
| Invoice creation | 460-line client flow, no unsaved-changes guard on navigation away (VERIFY at implementation time, FE-PAGES-004 scope) |
| Purchase order receive | `confirm('هل وصلت البضاعة؟…')` conflates confirmation with explanation of a stock-mutating side effect (purchase-orders/page.jsx:115) |
| Print receipts | two different print mechanisms (print CSS vs innerHTML swap+reload) |
| Login failure | VERIFY: error display present but styling/aria wiring unchecked |

## Empty / Loading / Error State Coverage

- Present: skeleton loaders on dashboard/customers/products tables (via `ui/skeleton.jsx`, common/LoadingState).
- Missing/inconsistent: several report pages and dialogs have no empty state (blank table body), no error-retry state beyond `(protected)/error.jsx` segment boundary.
Full per-page matrix produced as part of FE-PAGES-005 acceptance.

## Positives Worth Preserving

- RTL-first layout with logical spacing; container max-w-7xl shell is consistent.
- Consistent card-based stat sections across dashboard/financial/accounting.
- Arabic microcopy is consistent in tone across toasts.
