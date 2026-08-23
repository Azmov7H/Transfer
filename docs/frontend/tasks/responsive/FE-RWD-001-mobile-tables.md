# FE-RWD-001 — Mobile Table Pattern

## Sprint
Sprint 06

## Branch
feat/frontend-sprint-06-responsive

## Priority
P2

## Severity
MEDIUM (RWD-001)

## Objective
High-traffic tables degrade to a card/list layout on small screens instead of wide horizontal scroll.

## Problem
17 tables rely on `overflow-x-auto` only; on phones, operational users must scroll horizontally to reach row actions.

## Evidence
09-responsive-audit.md RWD-001.

## Root Cause
Desktop-first table markup without a mobile strategy.

## Scope
### In Scope
- Shared `ResponsiveTable` pattern: renders standard table ≥md, stacked cards below (primary fields + inline actions).
- Apply to: customers, products, invoices list, stock (top 4 by usage).
### Out of Scope
Remaining tables (follow-up backlog); desktop changes.

## Affected Files
- new `src/components/ui/responsive-table.jsx` or wrapper convention
- 4 list views from Sprint 05 extractions

## Implementation Steps
1. Define card field mapping per entity.
2. Build shared wrapper consuming column definitions.
3. Migrate four views; verify actions reachable one-handed.

## Dependencies
Sprint 05 (views extracted; avoids double work).

## Risks
Field-priority choices per entity — confirm with product owner if available.

## Testing Requirements
360px viewport walk; touch action verification.

## Acceptance Criteria
- [ ] No full-page horizontal scroll at 360px on the four pages
- [ ] One shared implementation

## Definition of Done
Standard DoD + screenshots.

## Related Findings
RWD-001 · **Related Tasks:** FE-PAGES-005, FE-RWD-002
