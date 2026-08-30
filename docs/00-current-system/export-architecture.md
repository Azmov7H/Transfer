# Export Architecture & Audit

## Scope of Audit

Searched the entire `Jammaz-System` frontend and `be-Jammaz` backend for export functionality:
`export`, `Export`, `csv`, `xlsx`, `XLSX`, `Blob`, `download`, `jsPDF`, `autotable`, `jspdf`.

## Inventory of Export Implementations

### 1. `components/common/ExportButton.jsx` (FRONTEND)
- **Trigger:** dropdown "Excel (الكل)" / "PDF (الحالي)". Currently imported only by
  `app/(protected)/(admin)/users/page.jsx:9,87`.
- **Excel path (`handleExcelExport`):**
  ```js
  fetch('/api/export', { method:'POST', body: JSON.stringify({ type, format:'excel' }) })
  const blob = await res.blob();
  a.download = `${type}_report_${date}.xlsx`;
  ```
  - **DEFECT (CRITICAL):** `POST /api/export` has **no backend route** in `be-Jammaz` (confirmed:
    no `exportRoutes` and no handler registers `/api/export`). The fetch returns 404 → `throw` →
    `toast.error('حدث خطأ أثناء التصدير')`. **Excel export is completely non-functional.**
  - The file is labeled `.xlsx` but even on success there is no XLSX library on either side
    (no `xlsx`/`exceljs` dependency in either `package.json`).
- **PDF path (`handlePDFExport`):**
  - Dynamically imports `jspdf` + `jspdf-autotable` (lazy-loaded — good for bundle size).
  - Builds table from `columns`/`data` props.
  - **DEFECT (HIGH):** Uses default `helvetica` font. **jsPDF default fonts do NOT support Arabic** →
    exported PDF shows garbled/tofu Arabic text. Code comment acknowledges this
    (`// Note: jsPDF default fonts don't support Arabic`).
  - Only exports the **client-side `data` prop** (the currently loaded page), ignoring server-side
    filtering/pagination → inconsistent with applied filters.

### 2. `app/(protected)/accounting/page.jsx` — `exportToCSV` (FRONTEND)
- **Trigger:** `handleExport` (button + Ctrl/Cmd+E), `onExport` in `FiltersBar`.
- **Behavior:** builds CSV string from `allEntriesData.entries`, prepends UTF-8 BOM (`\uFEFF`),
  creates `Blob`, downloads `accounting-entries-<date>.csv`.
- **Status:** WORKING. Proper Arabic support via BOM. **But** only covers accounting entries; does not
  respect server-side pagination beyond what's already loaded; no column/permission abstraction.

### 3. `components/accounting/FiltersBar.jsx` — `onExport` prop
- Passes export responsibility up to the accounting page. No standalone export.

### 4. Backend report endpoints (`reportRoutes.js`) — JSON ONLY
- `/api/reports/sales`, `/api/reports/financial`, `/api/reports/customer-profit`,
  `/api/reports/inventory`, `/api/reports/shortage`, `/api/reports/price-history`, `/api/dashboard`.
- All return JSON consumed by UI charts/tables. **None produce downloadable files.**
- There is **no server-side CSV/XLSX/PDF generation** anywhere in `be-Jammaz`.

## Summary Table

| Module | Trigger | Backend | Format | Arabic | Status |
|--------|---------|---------|--------|--------|--------|
| Users (ExportButton) | dropdown | ❌ missing `/api/export` | xlsx (claimed) | n/a | BROKEN |
| Users (ExportButton) | dropdown | client-only | PDF | ❌ garbled | BROKEN |
| Accounting | button/Ctrl+E | client-only | CSV (BOM) | ✅ | WORKING (limited) |
| Reports (sales/financial/etc.) | n/a | JSON only | — | — | NO EXPORT |
| Customers | n/a | JSON only | — | — | NO EXPORT |
| Suppliers | n/a | JSON only | — | — | NO EXPORT |
| Products | n/a | JSON only | — | — | NO EXPORT |
| Invoices | n/a | JSON only | — | — | NO EXPORT |
| Purchase Orders | n/a | JSON only | — | — | NO EXPORT |
| Treasury / Transactions | n/a | JSON only | — | — | NO EXPORT |

## Security Observations (Export)

- All backend routes are behind `authMiddleware` (so any *future* `/api/export` must keep that).
- Today the broken Excel endpoint means **no server-side export authorization is exercised at all**.
- The working CSV export runs client-side: it renders whatever the user's session already fetched,
  so it inherits the UI's existing permission filters — acceptable, but it **cannot enforce server-side
  row-level filters** (e.g., a user who can see page 1 only exports page 1).
- PDF export uses client `data` only → same limitation; also leaks nothing extra but is incomplete.

## Required Repairs (detailed in `01-requirements/export-repair.md` and `04-backend`, `03-frontend`)

1. **Implement server-side export** (`/api/export` or per-resource endpoints) that:
   - authenticates + authorizes (reuse `authMiddleware` + role checks),
   - accepts the **same filters** the UI applied (date range, search, type, pagination=all),
   - streams CSV or XLSX, and optionally PDF.
2. **Arabic in PDF:** embed an Arabic-capable font (e.g., Amiri/Noto Naskh via base64) or render server-side
   with a library that supports RTL (e.g., `pdfkit` + `pdfkit-arabic` or `exceljs` for XLSX and a proper
   RTL PDF generator). Decide library in implementation (see risk REG-EXP-*).
3. **Single source of truth** for exportable columns/filters per module (avoid ad-hoc per-page CSV).
4. **Large datasets:** stream or paginate-server-side; never build giant strings in the browser.
5. **RTL + Arabic number/date formatting** consistent with UI locale (`ar`, Hijri/gregorian per settings).
6. Decommission or fix `ExportButton` so it calls the real endpoint.
