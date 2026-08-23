# FE-ARCH-002 — Target Architecture ADR

## Sprint
Sprint 01

## Branch
feat/frontend-sprint-01-architecture

## Priority
P2

## Severity
MEDIUM (governs ARCH-001/NEXT-001 remediation quality)

## Objective
Commit the agreed architecture decisions to docs so sprints 02–11 and future contributors implement against a written contract.

## Problem
Decisions implicit in code: client-first rendering, hooks-calling-api-directly, per-page role checks. Each sprint would otherwise re-litigate them.

## Evidence
docs/frontend/02-architecture-audit.md, 03-next-react-audit.md.

## Root Cause
No ADR tradition in repo.

## Scope
### In Scope
Update `docs/frontend/architecture/target.md` (and `dependency-graph.md`, `frontend-data-flow.md`) codifying:
1. Rendering strategy: client components + TanStack Query remain the norm; RSC adopted opportunistically with measured wins only.
2. Data access rule: UI → hooks → services → api fetcher; no direct `api` imports in pages/components.
3. Authorization UX rule: RoleGate + permissions lib; no stringly-typed roles.
4. Form rule: RHF+zod adapter.
5. Folder conventions + naming; import boundary rules.
### Out of Scope
Any source change.

## Affected Files
- `docs/frontend/architecture/*.md`

## Implementation Steps
1. Draft each decision with context/consequences format.
2. Cross-link from README.

## Dependencies
Sprint 01 tasks order: last.

## Risks
None.

## Testing Requirements
Docs review in PR.

## Acceptance Criteria
- [ ] Five decision records present and linked

## Definition of Done
Standard DoD (docs-only variant).

## Related Findings
ARCH-001..006, NEXT-001 · **Related Tasks:** all subsequent sprints reference this
