# Sprint 02 — Data Layer & State Management

## Objective
Make the fetch layer correct (dedup, cancellation, expiry-ready hooks), unify endpoint contracts, and stop unauthenticated polling.

## Why This Sprint Exists
The fetcher is the single most-shared module; its bugs (DATA-001/002/004) amplify into every page. Contracts must be centralized before god-page decomposition so extracted components call stable service functions.

## Scope
- Fix deduplication semantics in `api-utils.js` (GET dedup yes, mutation coalescing no).
- Add timeout + AbortSignal plumbing to `fetcher`; wire React Query signals.
- Centralize endpoint URLs + JSDoc response contracts into services; migrate hooks.
- Unified mutation success/error toast policy helper.
- Gate notification polling on session presence.
- Fix `useUserRole` shape handling + query config drift.

## Out of Scope
401 redirect behavior (Sprint 03 — needs auth UX decisions); any UI changes beyond toasts standardization; form patterns.

## Branch
`feat/frontend-sprint-02-data-state`

## Findings Addressed
DATA-001, DATA-002, DATA-003, DATA-004, DATA-005, STATE-001, ARCH-002

## Tasks
- FE-DATA-001 — Fix inverted deduplication (`tasks/data/FE-DATA-001-dedup-fix.md`)
- FE-DATA-002 — Timeout + cancellation (`tasks/data/FE-DATA-002-timeout-abort.md`)
- FE-DATA-003 — Toast/error policy helper (`tasks/data/FE-DATA-003-toast-policy.md`)
- FE-DATA-004 — Auth-gated polling (`tasks/data/FE-DATA-004-auth-gated-polling.md`)
- FE-DATA-005 — Service contracts consolidation (`tasks/data/FE-DATA-005-service-contracts.md`)
- FE-STATE-001 — useUserRole correctness (`tasks/state/FE-STATE-001-user-role-shape.md`)

## Dependencies
Sprint 01 (error surfaces catch regressions). FE-DATA-005 after 001–003 stabilize the fetcher.

## Implementation Order
1. FE-DATA-001
2. FE-DATA-002
3. FE-STATE-001
4. FE-DATA-004
5. FE-DATA-003
6. FE-DATA-005

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: double-click a delete → exactly one request (network tab); throttle API → requests abort on unmount; logged-out /login → zero `/api/notifications` calls.

## Acceptance Criteria
- Identical concurrent GETs share one request; identical concurrent mutations do NOT silently merge.
- All queries/mutations pass abort signals; hung backend resolves via timeout error path.
- One module owns each endpoint URL string.
- No polling while logged out.

## Definition of Done
Standard DoD.

## Expected Result
Data layer is predictable and observable; pages can be decomposed safely next.
