# FE-UX-002 — Design Token Audit

## Sprint
Sprint 04

## Branch
feat/frontend-sprint-04-ui-system

## Priority
P3

## Severity
LOW (UX-002 adjacent, visual consistency)

## Objective
Hardcoded colors and significant inline styles migrated to theme tokens in the worst offenders.

## Problem
Design tokens exist (globals.css + tailwind config) but spot-checks find hardcoded hex/rgb values and `style=` usage scattered across feature components, causing dark-mode and consistency drift.

## Evidence
Static scan during audit; full inventory to be produced at task start (`grep -n "#[0-9a-fA-F]\{3,6\}\|style={{" src/components src/app`).

## Root Cause
No token discipline rule.

## Scope
### In Scope
- Inventory + migrate top offenders (target: zero hardcoded colors outside globals.css/tokens).
- Add ESLint restriction once feasible (documented suggestion).
### Out of Scope
Chart library internal colors until FE-PERF-002; third-party shadcn primitives' internals.

## Affected Files
- TBD from inventory (expect ~10–20 files)

## Implementation Steps
1. Produce inventory table in PR description.
2. Migrate worst offenders to semantic tokens (foreground/muted/destructive/etc.).
3. Verify both light and dark themes.

## Dependencies
None within sprint; after FE-COMP-001/002 to avoid conflicts.

## Risks
Visual regressions in dark mode → verify both themes per file.

## Testing Requirements
Manual light/dark pass on affected surfaces.

## Acceptance Criteria
- [ ] Inventory documented; worst offenders tokenized

## Definition of Done
Standard DoD.

## Related Findings
UX-002 (visual) · **Related Tasks:** FE-PERF-002
