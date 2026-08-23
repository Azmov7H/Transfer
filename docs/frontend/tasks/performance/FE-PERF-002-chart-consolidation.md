# FE-PERF-002 — Single Chart Library

## Sprint
Sprint 08

## Branch
feat/frontend-sprint-08-performance

## Priority
P2

## Severity
MEDIUM (PERF-002)

## Objective
One charting runtime in the bundle.

## Problem
Both chart.js+react-chartjs-2 (stock page, SalesChart) and recharts (RevenueChartContent) are installed and used — two runtimes for three charts.

## Evidence
11-performance-audit.md PERF-002 usage table.

## Root Cause
Charts added at different times by different hands.

## Scope
### In Scope
- Migrate chart.js sites to recharts (recommended: dashboard already uses it; API familiarity for declarative RTL labels).
- Remove chart.js/react-chartjs-2 from package.json + next.config optimizePackageImports entries.
### Out of Scope
Visual redesign beyond faithful recreation.

## Affected Files
- `(operations)/stock/page.jsx`, `components/reports/SalesChart.jsx`
- `package.json`, `next.config.mjs`

## Implementation Steps
1. Recreate stock page line/bar charts in recharts; pixel/label parity review.
2. Migrate SalesChart.
3. Remove deps + config entries; build.

## Dependencies
Sprint 05 (chart locations final).

## Risks
chart.js-specific styling (RTL axis, tooltips) needs careful reimplementation — compare side-by-side before deleting old code.

## Testing Requirements
Visual comparison screenshots old vs new per chart.

## Acceptance Criteria
- [ ] Single chart lib in dependencies
- [ ] Charts visually equivalent

## Definition of Done
Standard DoD + comparisons.

## Related Findings
PERF-002 · **Related Tasks:** FE-PERF-003, FE-CLEAN-002
