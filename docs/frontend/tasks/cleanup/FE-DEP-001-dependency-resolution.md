# FE-DEP-001 — Dependency Resolution

## Sprint
Sprint 10

## Branch
feat/frontend-sprint-10-cleanup

## Priority
P2

## Severity
MEDIUM (DEP-001/002)

## Objective
Every dependency earns its place; audit findings recorded.

## Problem
Unused/redundant packages: react-hook-form status depends on FE-FORM-001 rollout; `dotenv` unused at runtime; dual animate plugins (`tailwindcss-animate` + `tw-animate-css`); chart.js leftover post FE-PERF-002.

## Evidence
16-dependency-audit.md table.

## Root Cause
Aspirational installs + plugin duplication.

## Scope
### In Scope
- Remove: dotenv, chart.js+react-chartjs-2 (post-migration), losing animate-plugin duplicate (check tailwind.config reference first).
- react-hook-form: retain (FE-FORM-001 pattern adopted) — record decision.
- Run `pnpm audit`; fix or risk-accept criticals in writing.
### Out of Scope
Version upgrades of retained majors; Tailwind 4.

## Affected Files
- package.json, lockfile, tailwind.config.js

## Implementation Steps
1. Verify each removal with grep before uninstall.
2. Uninstall → build → test.
3. Record audit output + dispositions.

## Dependencies
FE-PERF-002, FE-CLEAN-002, FE-FORM-001 outcome.

## Risks
Removing a plugin referenced in config breaks styling → build check catches.

## Testing Requirements
Full gates + visual smoke of animations/dark mode.

## Acceptance Criteria
- [ ] No dependency without a runtime import or documented reason
- [ ] Audit disposition recorded

## Definition of Done
Standard DoD.

## Related Findings
DEP-001 · **Related Tasks:** FE-CLEAN-002, FE-PERF-002
