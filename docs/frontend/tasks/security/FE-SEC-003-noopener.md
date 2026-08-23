# FE-SEC-003 — window.open Hardening

## Sprint
Sprint 03

## Branch
feat/frontend-sprint-03-auth-security

## Priority
P3

## Severity
LOW (SEC-003)

## Objective
No opened tab retains opener access.

## Problem
`customers/[id]/CustomerClient.jsx:374` — `window.open(url, '_blank')` without features; reverse-tabnabbing hardening only (URL is internal, risk theoretical).

## Evidence
grep window.open → single hit.

## Scope
### In Scope
- Add `'noopener,noreferrer'` features argument.
### Out of Scope
Navigation UX changes.

## Affected Files
- `src/app/(protected)/customers/[id]/CustomerClient.jsx`

## Implementation Steps
1. One-line change + comment-free per code style.

## Dependencies
None.

## Risks
None.

## Testing Requirements
Manual click-through: receipts tab opens and functions.

## Acceptance Criteria
- [ ] noopener present

## Definition of Done
Standard DoD.

## Related Findings
SEC-003 · **Related Tasks:** none
