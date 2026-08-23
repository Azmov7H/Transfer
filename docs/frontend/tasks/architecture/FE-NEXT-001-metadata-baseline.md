# FE-NEXT-001 — Metadata Baseline

## Sprint
Sprint 01

## Branch
feat/frontend-sprint-01-architecture

## Priority
P2

## Severity
MEDIUM (SEO-001), part of NEXT-001

## Objective
Every route presents a meaningful, distinct Arabic tab title; internal app marked no-index.

## Problem
Only `app/layout.jsx:16` exports static metadata; 40+ routes share one title; no template; default English 404 (covered by FE-ARCH-001).

## Evidence
`grep "export const metadata" src/app` → single hit.

## Root Cause
Metadata never revisited after initial scaffold.

## Scope
### In Scope
- Root metadata: `title.template = '%s | مخازن الجماز'`, description, `robots: { index: false }`.
- Per-layout or per-page titles for major sections (invoices, customers, products, financial, reports, admin pages).
### Out of Scope
OG/Twitter cards, sitemap, structured data (unnecessary for internal tool — documented decision).

## Affected Files
- `src/app/layout.jsx`
- ~8 layout/page files adding `export const metadata` where segment is server-rendered at that level (client pages inherit nearest server ancestor's export)

## Implementation Steps
1. Add template + robots to root metadata.
2. Add section titles at route-group layouts where possible to minimize file count.
3. Verify client pages under each group resolve correct title.

## Dependencies
FE-ARCH-001 (same branch, do after error surfaces).

## Risks
None functional.

## Testing Requirements
Manual: navigate 5 sections → distinct `<title>`; view-source shows noindex.

## Acceptance Criteria
- [ ] Distinct titles across all major sections
- [ ] noindex set

## Definition of Done
Standard DoD.

## Related Findings
SEO-001 · **Related Tasks:** FE-ARCH-001
