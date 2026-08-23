# FE-PAGES-002 — Decompose Settings Page

## Sprint
Sprint 05

## Branch
feat/frontend-sprint-05-pages-ux

## Priority
P2

## Severity
HIGH (ARCH-001)

## Objective
Split the 694-line admin settings page into per-tab feature components.

## Problem
`(admin)/settings/page.jsx` handles multiple settings domains in one file with inline forms and state.

## Evidence
Line count + audit read; ARCH-001 table.

## Root Cause
Tab content grown in place.

## Scope
### In Scope
Extract tab panels to `src/components/settings/`; forms adopt FE-FORM-001; states adopt FE-COMP-002; wrap in RoleGate (FE-AUTH-002).
### Out of Scope
Settings domain redesign; backend contract changes.

## Affected Files
- `(admin)/settings/page.jsx`
- new `src/components/settings/**`

## Implementation Steps
1. Enumerate tabs → component map.
2. Extract one tab per commit (pilot for the sprint).
3. Verify persistence flows end-to-end per tab.

## Dependencies
Sprints 02–04. First decomposition of the sprint (lowest traffic = safest pilot).

## Risks
Low — settings changes are infrequent but sensitive; test save paths carefully.

## Testing Requirements
Save/reload round-trip per setting domain.

## Acceptance Criteria
- [ ] Each tab an isolated component <300 lines total file set
- [ ] page.jsx composition-only

## Definition of Done
Standard DoD + parity notes.

## Related Findings
ARCH-001 · **Related Tasks:** FE-FORM-001, FE-AUTH-002
