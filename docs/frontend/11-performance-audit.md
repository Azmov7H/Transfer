# 11 — Performance Audit

## Bundle

### PERF-001 — Heavy Export Libraries Statically Imported (HIGH)
- `services/exportService.js:1-2` — `import ExcelJS from 'exceljs'` + `import { jsPDF } from 'jspdf'` at module top. **This service has zero importers** → tree-shaking should drop it, but it remains one refactor away from entering the graph.
- `components/common/ExportButton.jsx:13-14` — `jsPDF` + `jspdf-autotable` static imports; ExportButton is imported by `(admin)/users/page.jsx` → every visit to /users downloads jsPDF+autotable (~300KB+) in that route chunk.
Remediation FE-PERF-001 (dynamic import on click) + deletion of dead exportService.

### PERF-002 — Two Chart Libraries Shipped (MEDIUM)
- chart.js + react-chartjs-2: `(operations)/stock/page.jsx:44-45`, `reports/SalesChart.jsx`
- recharts: `dashboard/RevenueChartContent.jsx:11`
Both are in `optimizePackageImports`, but two runtimes (~150KB+ combined) for ~3 charts is unjustified. Consolidate to one. Remediation FE-PERF-002.

### PERF-003 — framer-motion in 19 Files (LOW)
Used heavily for dialog/list animations including inside page-level files (`invoices/new`, `physical-inventory/*`). Acceptable; audit during Sprint 08 for pages that could use CSS transitions.

## Rendering

### PERF-004 — Client-Everything Model (see NEXT-001, HIGH)
First paint requires: JS hydration → session fetch → data fetches. No RSC prefetching anywhere. Biggest structural performance lever available.

### PERF-005 — Polling Cost (MEDIUM)
30s notification polling for every open tab regardless of visibility handling (`refetchIntervalInBackground:false` ✅ at least stops background tabs) and regardless of auth state (DATA-004).

## Network
- Request waterfalls: session fetch → role-gated content fetch on role-dependent pages (inherent to client auth UX; mitigated if AUTH fixes land).
- Debounced search (500ms) prevents storms ✅.
- No image optimization issues found (icon.png + favicon only); fonts self-hosted via next/font ✅.
- No pagination virtualization needed yet: lists default limit 50 via useFilters — fine without virtualization; revisit only if limits grow (INFO).

## Next.js Config Positives
`compress`, `poweredByHeader:false`, `optimizePackageImports` for 20 packages, `removeConsole` in prod, AVIF/WebP image config.
