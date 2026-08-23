# Frontend Dependency Graph

Verified import relationships (audit evidence; re-verify after Sprint 10 cleanup).

## Layer graph (allowed direction ↓)
```
app/ (pages/layouts)
  → components/**  → hooks/**  → services/**  → lib/api-utils.js
components/ui/**    (leaf primitives; may import utils)
hooks/**            → services + lib/api-utils + providers
services/**         → lib/api-utils only
lib/permissions     ← components/auth/RoleGate, config/navigation consumers
utils/index.js      ← everything (leaf)
validations/**      ← forms adapter, tests   (currently: tests only — FE-FORM-001 fixes)
```

## Violations to eliminate (Sprint 02/05)
- `financial/page.jsx`, `useHeader.js`, `useUserRole.js`, `NotificationContext.jsx` import `api` directly instead of via services.
- Hooks duplicate service URLs inline (useCustomers vs customerService.js).

## Dead nodes (delete in Sprint 10)
`lib/auth.js` · `lib/cache.js` · `lib/cache-config.js` · `lib/api-response.js` · `services/exportService.js` · `ThemeToggle.jsx` · `themes/Toggle.jsx` · `AuthService.handleGoogleCallback`.

## External dependency edges of note
- chart.js+react-chartjs-2 AND recharts both reached from UI (consolidate → PERF-002).
- jspdf/exceljs reached statically via ExportButton (lazy-load → PERF-001).
- framer-motion reached from 19 files.
