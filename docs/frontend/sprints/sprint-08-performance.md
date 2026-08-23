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
