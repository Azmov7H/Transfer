# Dependency Dispositions — Sprint 10 (FE-DEP-001)

`pnpm audit` before: **28 vulnerabilities (3 low, 15 moderate, 8 high, 2 critical)** — all traced to `jspdf@2.5.2` (+ `dompurify` transitively).
`pnpm audit` after: **No known vulnerabilities found.**

| Package | Decision | Reason |
|---|---|---|
| `jspdf` | **Upgraded** `^2.5.2` → `^4.2.1` | Resolves both criticals (LFI/path traversal, HTML injection) and 8 highs. API used by ExportButton (`new jsPDF()`, `text`, `save`, functional autoTable) is stable across majors; build + tests green. |
| `jspdf-autotable` | **Upgraded** `^3.8.4` → `^5.0.8` | Required pairing for jspdf v4; same call signature `autoTable(doc, opts)`. |
| `dotenv` | **Removed** | Zero imports in src/ or any config file. Next.js loads .env natively. |
| `exceljs` | **Removed** | Leftover from FE-PERF-001: `exportService.js` was deleted but the dep entry remained; zero imports remain. |
| `tw-animate-css` | **Removed** (devDep) | Unused duplicate; `tailwind.config.js` plugins require `tailwindcss-animate`, which is retained. |
| `chart.js` / `react-chartjs-2` | Already removed in Sprint 08 (FE-PERF-002). | — |
| `react-hook-form` | **Retained** | FE-FORM-001 pattern adopted (`CustomerFormDialog`, `ProductFormDialog` via dependency-free zodResolver shim); runtime import verified. |
| `next-themes` | **Retained** | Runtime imports verified (`theme-provider.jsx`, `useHeader.js`, `RevenueChartContent.jsx`). |
| All other deps | Retained | Runtime import verified during audit re-check. |
