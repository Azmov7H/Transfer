# FE-DATA-001 — Fix Inverted Request Deduplication

## Sprint
Sprint 02

## Branch
feat/frontend-sprint-02-data-state

## Priority
P0

## Severity
HIGH (DATA-001)

## Objective
Deduplicate concurrent identical GETs; never silently coalesce mutations.

## Problem
`api-utils.js:66-73` deduplicates only POST/PUT/DELETE/PATCH via key `${method}:${url}:${body}` — identical rapid mutations share one promise (accidental double-submit guard, dangerous semantics), while GETs (which need dedup) get none.

## Evidence
findings/high.md DATA-001; code cited above.

## Root Cause
Misunderstood requirement during implementation ("prevent double submit" implemented as request coalescing).

## Scope
### In Scope
- `fetcher()`: dedup GETs by URL(+params); remove mutation coalescing.
- Keep an opt-in `skipDeduplication`-style escape hatch or invert to `dedupe: true`.
### Out of Scope
Double-submit protection at UI layer (FE-FORM-001 / RHF isSubmitting).

## Affected Files
- `src/lib/api-utils.js`

## Implementation Steps
1. Restrict dedup map to GET; document semantics in JSDoc.
2. Remove mutation branch; verify no caller relied on it as a guard (grep call sites passing skipDeduplication — currently none expected).
3. Add unit-testable pure function for request keys if trivial.

## Dependencies
Sprint 01.

## Risks
Removing accidental double-submit coalescing could surface duplicate submissions in dialogs lacking guards → mitigate by landing FE-FORM-001 soon after and noting risk in PR.

## Testing Requirements
Unit tests (added now minimally or in Sprint 09): two concurrent identical GETs → one fetch; two identical POSTs → two fetches.

## Acceptance Criteria
- [ ] GETs deduped; mutations never merged
- [ ] Behavior verified via network tab on delete/add flows

## Definition of Done
Standard DoD.

## Related Findings
DATA-001 · **Related Tasks:** FE-FORM-001, FE-TEST-003
