# 17 — Code Quality & Cleanup Audit

## Dead Code Registry (verified: zero importers in src/)

| ID | Item | Risk Class | Note |
|---|---|---|---|
| CLEAN-D1 | `src/lib/auth.js` — server JWT helpers | SAFE after verify | throws at import if JWT_SECRET missing; backend leftover |
| CLEAN-D2 | `src/lib/cache.js`, `cache-config.js` — RSC cache tags | SAFE | no API routes to cache |
| CLEAN-D3 | `src/lib/api-response.js` — ApiResponse helper | SAFE | no route.js files exist (`find` verified) |
| CLEAN-D4 | `services/exportService.js` | VERIFY | unused; check git history for recent consumers before deleting vs lazy-loading decision in FE-PERF-001 |
| CLEAN-D5 | `components/ThemeToggle.jsx`, `components/themes/Toggle.jsx` | SAFE | zero importers |
| CLEAN-D6 | `AuthService.handleGoogleCallback` | SAFE | no Google flow exists |
| CLEAN-D7 | `hooks/useMutationLock.js` | VERIFY | confirm consumers during Sprint 04 form work |
| CLEAN-D8 | `components/ui/sidebar.jsx` exports | VERIFY | 682-line shadcn file; confirm which exports are used by live Sidebar chain |

## Commented-Out Code
- `context/NotificationContext.jsx:56` — disabled action-API call
- `lib/api-utils.js:103-108` — disabled 401 redirect (superseded by FE-AUTH-001 implementation)
- `components/invoices/InvoiceCustomerSelect.jsx:36`
Removal tracked in FE-CLEAN-003.

## TODO/FIXME/HACK
None found in src/ ✅.

## Naming / Consistency
- `components/Logo/Logo.jsx` — capitalized dir breaks convention (LOW).
- Duplicate formatting helpers: local `formatCurrency` re-implementations shadow `utils/index.js` in `SalesChart.jsx:19` and `reports/sales/page.jsx:44` (LOW → fold into FE-PAGES tasks touching those files).
- Mixed quote styles and import ordering across files; auto-fixable once ESLint runs (Sprint 00 unblocks).

## Over-engineering Check
- Request-dedup map in fetcher: over-engineered **and** mis-targeted (DATA-001) — simplify rather than extend.
- No premature abstractions elsewhere; services layer is if anything under-used (ARCH-002).

## Categorization Rule Applied
No deletion recommended on filename intuition alone; every SAFE item above was import-verified, every VERIFY item names its verification step.
