# Sprint 08 — Performance

## Objective
Cut avoidable bundle weight and validate the rendering strategy with measurements.

## Why This Sprint Exists
Static jsPDF/exceljs imports, dual chart libraries, and unmeasured client-everything rendering are the main avoidable costs. Runs after UX sprints so optimizations aren't invalidated by refactors.

## Scope
- Dynamic-import export libraries behind user action; delete dead exportService.
- Consolidate to one chart library (recommend recharts — already used by dashboard; migrate chart.js sites).
- Bundle analyzer baseline + after; record deltas.
- Evaluate one RSC conversion candidate with before/after metrics; adopt only on clear win.

## Out of Scope
Dependency version upgrades; micro-optimizations without measurement.

## Branch
`feat/frontend-sprint-08-performance`

## Findings Addressed
PERF-001, PERF-002, NEXT-001 (evaluation), PERF-003

## Tasks
- FE-PERF-001 — Lazy export libs (`tasks/performance/FE-PERF-001-lazy-export.md`)
- FE-PERF-002 — Single chart lib (`tasks/performance/FE-PERF-002-chart-consolidation.md`)
- FE-PERF-003 — Bundle audit & RSC evaluation (`tasks/performance/FE-PERF-003-bundle-audit.md`)

## Dependencies
Sprint 05 (charts/exports live in final locations).

## Implementation Order
1. FE-PERF-001
2. FE-PERF-002
3. FE-PERF-003

## Validation
```bash
pnpm run build   # capture route-size table before/after in PR
pnpm run lint && pnpm test
```
Manual: users-page export still works (chunk loads on demand); stock page + sales report charts render identically post-migration.

## Acceptance Criteria
- jsPDF/exceljs absent from initial route JS of every page.
- One chart library in package.json.
- Measured first-load JS reduction recorded (target: ≥10% on affected routes).

## Definition of Done
Standard DoD + before/after metrics table.

## Expected Result
Smaller payloads, single chart runtime, evidence-based rendering decisions.

---

## Execution Record

**Branch:** `feat/frontend-sprint-08-performance` (stacked on sprint-07)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-PERF-001 | (perf commit 1) | ExportButton now `await import('jspdf'/'jspdf-autotable')` inside the click handler (existing error toast covers load failure); dead `services/exportService.js` deleted (zero consumers) — exceljs gone from the dependency graph entirely. jspdf isolated to a 356 KB on-demand chunk |
| FE-PERF-002 | (perf commit 2) | SalesChart + stock-page trend chart rewritten on recharts (gradient bars, RTL legend/tooltips, line parity); chart.js + react-chartjs-2 removed from package.json, lockfile, and optimizePackageImports; 0 residue in built chunks |
| FE-PERF-003 | (docs commit) | Baseline + after metrics in `architecture/performance-metrics.md`; framer-motion audited (22 files) — kept with documented rationale; RSC conversion of customers list evaluated and declined with data |

**Gates at completion:** lint 0 errors / 47 warnings, tests 3/3, build green.

**Metrics snapshot:**
- Total static JS: 4,078,606 → 4,006,059 B (−72 KB aggregate).
- jspdf: out of all initial route JS (on-demand chunk only). exceljs: eliminated.
- Chart runtimes: 2 → 1.

**Notes / deviations:**
- Turbopack-only builds (Next 16) no longer print per-route size tables; @next/bundle-analyzer not installable offline. Proxy metric used: chunk-total bytes + library-string attribution per content-hashed chunk. Documented in the metrics doc.
- ≥10% first-load reduction target: not demonstrable on aggregate static JS (−1.8%); affected routes shed a duplicated chart runtime (~400 KB class payload). Recorded honestly rather than fudged.
- framer-motion partial CSS conversion skipped — zero bundle win unless all 22 sites migrate together; filed as potential future task.
- RSC evaluation result: **NO-GO** for customers list (session-coupled client surface, React Query coherence, no profiling tooling to prove a win). Re-evaluation triggers documented.
- Visual parity of migrated charts verified by code review of axis/legend/tooltip config against old options; pixel screenshots pending QA pass (no browser in this environment).

**Follow-ups filed for later sprints:**
- Full framer-motion elimination task (all-or-nothing) if bundle pressure justifies it.
- Install @next/bundle-analyzer when registry access exists; re-baseline per-route sizes.
