# 09 — Responsive Audit

Static analysis findings; runtime verification tasks live in Sprint 06.

## Findings

### RWD-001 — Tables Have Overflow Wrappers but No Mobile Strategy (MEDIUM)
17 files wrap tables in `overflow-x-auto` (grep evidence incl. customers, products, stock, suppliers, audit, logs, debt-center, physical-inventory). On mobile this yields horizontally-scrolling wide tables — functional but poor for touch-heavy data entry (this is an operational app used on phones in warehouses/shops). No card/list fallback pattern exists anywhere. Remediation FE-RWD-001.

### RWD-002 — Responsive Shell Exists and Is Sound (INFO)
`Sidebar.jsx` + `useSidebarLogic` + `use-mobile.js` implement collapsible/off-canvas nav; `(protected)/layout.jsx` uses `flex min-h-screen` with `min-w-0` main column (correct flex overflow handling); container padding scales `p-4 md:p-6 lg:p-8`.

### RWD-003 — Touch Targets Unverified (MEDIUM, VERIFY)
Icon-only row actions (delete/edit buttons in `CustomerRow`, `ProductRow`, `InvoiceListItem`) appear to use default sm icon buttons (<44px targets) — needs runtime confirmation. FE-RWD-002.

### RWD-004 — Sticky/Fixed Elements (LOW, VERIFY)
Header is sticky; dialogs are viewport-fixed via Radix. Verify no overlap issues on small screens + virtual keyboard behavior on invoice creation form (mobile-heavy flow).

## Breakpoints
Tailwind defaults (`sm 640 / md 768 / lg 1024 / xl 1280`). `deviceSizes` capped at 1200 in next.config — fine for an internal tool; no custom breakpoints detected.
