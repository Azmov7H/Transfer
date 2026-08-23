# FE-DATA-002 — Timeouts & Request Cancellation

## Sprint
Sprint 02

## Branch
feat/frontend-sprint-02-data-state

## Priority
P1

## Severity
MEDIUM (DATA-002)

## Objective
Every request can time out; every query/mutation aborts when its owner unmounts.

## Problem
No `AbortController`, `signal`, or timeout exists in `src/`. A hung backend yields infinite spinners; navigating away leaks in-flight work.

## Evidence
grep AbortController/signal/timeout across src → zero hits.

## Root Cause
Fetcher written without cancellation support.

## Scope
### In Scope
- `fetcher()`: accept `signal`; apply default timeout (e.g. 30s, configurable) via combined AbortController.
- Map abort to a recognizable `JammazApiError` (e.g. `isTimeout`).
- React Query hooks: pass `signal` from `queryFn({signal})` context.
### Out of Scope
Retry policy changes; backend changes.

## Affected Files
- `src/lib/api-utils.js`
- hook files' queryFn signatures (mechanical, ~20 files)

## Implementation Steps
1. Extend fetcher options with signal + timeout composition.
2. Update a representative hook first (useCustomers), then mechanically migrate the rest.
3. Ensure timeout errors surface the standard Arabic "تعذر الاتصال بالخادم" message path.

## Dependencies
FE-DATA-001 (same file — land after).

## Risks
Low; timeout too aggressive could break slow report endpoints → make default generous and overridable per call.

## Testing Requirements
Manual: throttle network, navigate away → requests canceled (network tab); hung endpoint → timeout toast.

## Acceptance Criteria
- [ ] Queries abort on unmount
- [ ] Default timeout enforced and documented

## Definition of Done
Standard DoD.

## Related Findings
DATA-002 · **Related Tasks:** FE-DATA-001, FE-TEST-003
