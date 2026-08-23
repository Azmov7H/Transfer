# Sprint 01 — Architecture & Foundations

## Objective
Complete the app's error-recovery surfaces, establish metadata conventions, and document the target architecture so later sprints have a stable frame.

## Why This Sprint Exists
Before touching data/pages, every failure mode introduced by refactors must be catchable. Also unblocks UX work that needs `not-found` and titles.

## Scope
- Root `app/error.jsx`, `app/global-error.jsx`, Arabic `app/not-found.jsx`.
- Metadata template + per-layout titles; robots no-index for internal tool.
- Architecture decision record: rendering strategy (client-first retained, RSC incremental), folder conventions, import boundaries.

## Out of Scope
Component refactors; data-layer changes; ErrorBoundary widget placement decisions beyond mounting it where documented (FE-ARCH-001 decides).

## Branch
`feat/frontend-sprint-01-architecture`

## Findings Addressed
ERR-001, SEO-001, NEXT-001 (metadata portion)

## Tasks
- FE-ARCH-001 — Global error surfaces (`tasks/architecture/FE-ARCH-001-error-surfaces.md`)
- FE-NEXT-001 — Metadata baseline (`tasks/architecture/FE-NEXT-001-metadata-baseline.md`)
- FE-ARCH-002 — Target architecture ADR (`tasks/architecture/FE-ARCH-002-target-adr.md`)

## Dependencies
Sprint 00 (lint must run to validate new files).

## Implementation Order
1. FE-ARCH-001
2. FE-NEXT-001
3. FE-ARCH-002

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: navigate to a bogus URL → Arabic 404; temporarily throw in a page → error UI with reset; check `<title>` changes between /invoices and /customers.

## Acceptance Criteria
- No route can render a blank screen on uncaught error.
- 404 page is Arabic/RTL.
- Each section shows a distinct tab title.
- ADR committed under `docs/frontend/architecture/target.md` updates.

## Definition of Done
Standard DoD.

## Expected Result
Safe refactor environment for Sprints 02–05.

---

## Execution Record (completed)

Branch: `feat/frontend-sprint-01-architecture` (stacked on Sprint 00)

| Task | Commit | Result |
|---|---|---|
| FE-ARCH-001 | `c7a8f82` | Root `error.jsx`, self-contained `global-error.jsx`, RTL Arabic `not-found.jsx`; ErrorBoundary retirement decided (D8) |
| FE-NEXT-001 | `70d142b` | Title template + noindex in root; 15 section-title server layouts (client pages cannot export metadata) |
| FE-ARCH-002 | (this commit) | Decision Log D1–D9 committed to architecture/target.md |

Gates: lint ✅ (0 errors) · test ✅ (3/3) · build ✅ (35 routes after new layouts)

Notes:
- Build initially failed: global-error.css import used wrong relative path (`../` → `./`) — caught by gate, fixed before commit.
- Manual verification pending PR review: throw-in-page → root error UI; bogus URL → Arabic 404; distinct `<title>` per section.
