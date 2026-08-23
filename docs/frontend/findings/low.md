# LOW / INFO Findings

| ID | Severity | Title | Evidence | Task |
|---|---|---|---|---|
| SEC-003 | LOW | window.open without noopener | customers/[id]/CustomerClient.jsx:374 | FE-SEC-003 |
| RWD-001 | MEDIUM* | Tables overflow-only on mobile (*kept in sprint 06) | 17 files overflow-x-auto; no card fallback | FE-RWD-001 |
| FORM-002 | LOW→MEDIUM | No unsaved-changes guards | no beforeunload/route-guard anywhere | FE-PAGES-004 |
| CLEAN-002 | LOW | Commented-out code ×3 | NotificationContext.jsx:56; api-utils.js:103-108; InvoiceCustomerSelect.jsx:36 | FE-CLEAN-003 |
| DX-002 | LOW | Broken seed script | package.json:12 → scripts/seed.js missing | FE-DX-003 |
| DX-003 | LOW | No .env.example | required: JWT_SECRET, API_PROXY_TARGET, optional NEXT_PUBLIC_API_URL | FE-DX-003 |
| STATE-002 | LOW | Hydration-sensitive date init | financial/page.jsx:24-27 new Date() in useState initializer | FE-PAGES-001 |
| UX-002 | LOW | Duplicated format helpers | SalesChart.jsx:19 & reports/sales/page.jsx:44 re-implement formatCurrency vs utils/index.js | folded into FE-PAGES |
| SEC-004 | INFO | shadcn chart CSS injection pattern | ui/chart.jsx:66-81 — accepted pattern, config-sourced colors only | none |
| A11Y-004 | INFO (VERIFY) | RTL/focus-visible runtime pass needed | static scan clean | FE-RWD-002/FE-A11Y-002 |
