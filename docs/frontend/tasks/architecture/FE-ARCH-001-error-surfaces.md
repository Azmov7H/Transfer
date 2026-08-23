# FE-ARCH-001 — Global Error Surfaces

## Sprint
Sprint 01

## Branch
feat/frontend-sprint-01-architecture

## Priority
P0

## Severity
CRITICAL (ERR-001)

## Objective
No uncaught render error can ever produce a blank screen anywhere in the app.

## Problem
Only `(protected)/error.jsx` exists. Missing: root `app/error.jsx`, `app/global-error.jsx`, `app/not-found.jsx`. `src/components/ErrorBoundary.jsx` (with dev detail panel) has zero importers. Unknown URLs show Next's default English 404 in an Arabic RTL app.

## Evidence
`find src/app -name error.jsx -o -name not-found* -o -name global-error*`; ErrorBoundary import grep — see findings/critical.md.

## Root Cause
Partial error infrastructure never completed.

## Scope
### In Scope
- `src/app/error.jsx` — client boundary for root segment, Arabic UI, reset action.
- `src/app/global-error.jsx` — last-resort shell with html/body.
- `src/app/not-found.jsx` — Arabic/RTL 404 with link home.
- Decide + document whether existing `components/ErrorBoundary.jsx` is mounted for widget-level isolation or deleted in Sprint 10.
### Out of Scope
Per-widget boundaries across all pages; error-reporting service integration.

## Affected Files
- `src/app/error.jsx` (new), `src/app/global-error.jsx` (new), `src/app/not-found.jsx` (new)
- possibly reuse/retire `src/components/ErrorBoundary.jsx`

## Implementation Steps
1. Create the three files following Next App Router conventions ('use client' where required).
2. Arabic copy consistent with app tone; include recovery actions (retry, back, login).
3. Verify global-error renders without providers (it replaces root layout).
4. Test by throwing temporarily in a page and in layout.

## Dependencies
Sprint 00.

## Risks
global-error must be self-contained (no ThemeProvider) — style accordingly.

## Testing Requirements
Manual throws at page + layout level; bogus URL navigation; lint/build green.

## Acceptance Criteria
- [ ] All three surfaces render correctly in RTL Arabic
- [ ] Reset recovers without full reload where possible
- [ ] Decision recorded re: legacy ErrorBoundary component

## Definition of Done
Standard DoD.

## Related Findings
ERR-001 · **Related Tasks:** FE-NEXT-001
