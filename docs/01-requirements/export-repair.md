# REQ-EXP — Export Repair

## Business Requirement

Audit and repair the Export functionality throughout the system. Every relevant module containing export
functionality must be inspected and made correct, permission-respecting, Arabic/RTL-correct, and safe for
large datasets.

## Current State (see `00-current-system/export-architecture.md`)

- **Excel export is BROKEN**: `ExportButton.jsx` calls `POST /api/export` which has **no backend route**.
- **PDF export is BROKEN for Arabic**: jsPDF default font cannot render Arabic (garbled text).
- **Only working export**: Accounting CSV (`accounting/page.jsx`) — client-side, UTF-8 BOM, limited scope.
- **No server-side export** of Customers, Suppliers, Products, Invoices, Purchase Orders, Treasury,
  Reports, Sales, Purchases, Collections, Payments.

## Requirement Statements

- **REQ-EXP-001** — Implement a server-side export capability (new `/api/export` or per-resource endpoints)
  that authenticates and authorizes each request (reuse `authMiddleware` + role checks).
- **REQ-EXP-002** — Export MUST honor the **same filters** the user applied in the UI (date range, search,
  type, status) and export the **full** result set (not just the loaded page).
- **REQ-EXP-003** — Export MUST support CSV and XLSX at minimum; PDF where needed with correct Arabic.
- **REQ-EXP-004** — Arabic text and RTL layout MUST render correctly in exported files (embed Arabic font /
  use RTL-capable generator). No tofu/garbled output.
- **REQ-EXP-005** — Numbers and dates MUST be formatted per the system locale (`ar`, gregorian/hijri per
  settings) consistently with the UI.
- **REQ-EXP-006** — Large datasets MUST be handled safely (server-side streaming/pagination; no browser-side
  giant string building; respect memory + time limits; reuse existing `heavyLimiter` for report surfaces).
- **REQ-EXP-007** — Export MUST respect tenant/company isolation and user permissions; a user MUST NOT export
  data they cannot normally view.
- **REQ-EXP-008** — Every module with tabular data SHOULD offer export: Customers, Suppliers, Products,
  Sales/Invoices, Purchases/Purchase Orders, Collections, Payments, Treasury Transactions, Financial Reports,
  Accounting, Inventory, Shortage. (Discovery MUST enumerate all; see audit.)
- **REQ-EXP-009** — Column definitions for exports MUST be centralized (single source of truth) per module to
  avoid drift between UI columns and exported columns.
- **REQ-EXP-010** — Error handling: failed exports MUST surface a clear message; partial/empty results MUST
  export a header-only file or a friendly empty notice (no crash).

## Affected Modules (inventory)

Frontend triggers: `ExportButton.jsx` (users), `accounting/page.jsx` (CSV), `FiltersBar.jsx`.
Backend: **none today** (must add). Report data owners: `reportingService`, `customerService`,
`supplierService`, `productService`, `invoiceService`, `purchaseOrderService`, `treasuryService`,
`debtService`.

## Security Notes

- Must inherit `authMiddleware`; do not expose an unauthenticated export path.
- Sensitive fields (e.g., `sourceNumber` PII from REQ-VAL) MUST be excluded or masked in exports unless the
  role is explicitly permitted (owner/manager) — confirm with security plan `07-security`.
- Prevent export of another user's/branch's data via missing filters (IDOR on export params).

## Open Decisions (do not silently choose — document)

- **Library choice:** `exceljs` (XLSX + RTL) vs extending `jspdf-autotable` with an Arabic font vs a
  server-side HTML→PDF. Recommend `exceljs` for XLSX/CSV and a RTL-aware PDF lib. Finalized in
  `04-backend` + `03-frontend` + risk register `REG-EXP-*`.
- **Single `/api/export` dispatcher vs per-resource endpoints.** Recommend a dispatcher that delegates to
  each service's serializer to keep routes thin.
