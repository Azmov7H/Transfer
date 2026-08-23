# FE-PERF-001 — Lazy-Load Export Libraries

## Sprint
Sprint 08

## Branch
feat/frontend-sprint-08-performance

## Priority
P1

## Severity
HIGH (PERF-001)

## Objective
jsPDF/jspdf-autotable/exceljs load only when the user actually exports.

## Problem
`ExportButton.jsx:13-14` statically imports jsPDF+autotable → shipped in the /users route chunk; `services/exportService.js` statically imports exceljs+jspdf and is dead code one import away from any bundle.

## Evidence
11-performance-audit.md PERF-001.

## Root Cause
Top-level imports for action-triggered heavy libs.

## Scope
### In Scope
- ExportButton: `await import('jspdf')` inside click handler with loading state.
- Delete dead exportService.js OR convert to lazy functions if FE-PERF-001 review shows imminent need (decision recorded).
### Out of Scope
Export feature redesign.

## Affected Files
- `src/components/common/ExportButton.jsx`
- `src/services/exportService.js`

## Implementation Steps
1. Convert imports to dynamic inside handler.
2. Verify export output identical.
3. Compare route chunk sizes before/after (record).

## Dependencies
Sprint 05 merged (final component locations).

## Risks
Dynamic import failure UX — add error toast on load failure.

## Testing Requirements
Export PDF from users page; network tab confirms chunk fetched on demand only.

## Acceptance Criteria
- [ ] Heavy libs absent from all initial route JS
- [ ] Export still works

## Definition of Done
Standard DoD + size delta table.

## Related Findings
PERF-001 · **Related Tasks:** FE-CLEAN-002, FE-PERF-003
