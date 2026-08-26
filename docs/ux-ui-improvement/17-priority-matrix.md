# 17 — Priority Matrix

All UX tasks consolidated. Priority definitions: P0 blocks task completion / causes errors; P1 major friction; P2 friction with workaround; P3 polish.

## P0 — Critical (do first)
| ID | Task | Doc | Complexity |
|---|---|---|---|
| UX-080/081 | Unified payment dialog + entry-point re-pointing + legacy deletion | 11,15 | L |
| R2/UX-083 | Customers page decomposition → detail tabs | 03,15 | L |
| UX-030 | Eliminate sub-12px text | 06 | M |
| UX-100* | Financial hub tabs incl. receivables/accounting reachability (interim links) | 03,16 | M |

\* interim reachability part is P0; full tab merge P1.

## P1 — High
| ID | Task | Doc | Complexity |
|---|---|---|---|
| UX-020..027 (core sweeps) | Color token adoption | 05 | L total, per-sweep M |
| UX-031..033 | Type scale + PageHeader migration | 06 | M+L |
| UX-010..011 | Navigation config + sidebar pass | 04 | M |
| UX-050..051 | Dashboard restructure + attention panel | 08 | M |
| UX-060 | FormKit foundation | 09 | M |
| UX-070..074 | Table kit + StatusBadge + canonical migrations | 10 | L |
| UX-082 | Installment drawer | 11 | M |
| UX-090/091 | Overlay responsive variant + invoice/new mobile | 12 | M/L |

## P2 — Medium
| ID | Task | Doc |
|---|---|---|
| UX-012..015 | Header decluster, breadcrumbs, command palette decision, nav tests | 04 |
| UX-040..042,045 | Layout primitives, density, de-decoration, radius | 07 |
| UX-052..054 | KPIStat merge, suggestions demotion, truncation fixes | 08 |
| UX-061..065 | FormKit migrations + parity docs | 09 |
| UX-075..078 | Remaining table migrations, DateRangePicker | 10 |
| UX-092..094 | Reports/dashboard/filter responsive passes | 12 |
| UX-101 | Physical-inventory stepper presentation | 16 |

## P3 — Low
UX-035 (eslint bans) · UX-045 · UX-078 · UX-084 (notification deletions) · A8/A9 motion & numerals polish.

## Impact × Effort ranking (execution order hint)
1. UX-030 (tiny effort, huge legibility win)
2. UX-080/081 (biggest confusion killer)
3. R2 customers decomposition
4. UX-021..025 color sweeps (mechanical, unlocks everything visual)
5. UX-032/033 headers; UX-010/011 nav
6. Table kit wave starting invoices
7. FormKit + forms
8. Dashboard
9. Responsive passes
10. Polish/deletions

## Sequencing constraints
- Color/type sweeps precede component migrations (avoid double-touching files).
- UnifiedPayment before customers decomposition completes its payment tab.
- StatusBadge before any table migration.
- ESLint bans last (after allow-lists stabilize).
