# 19 — Implementation Roadmap

Phased plan; each phase = independently shippable, gates green (lint/tests/build), golden-flow scripts pass. Task IDs reference doc 17. Branch convention: one phase = one branch (`feat/ux-phase-N-*`), task-per-commit.

## Phase 0 — Foundation & Tripwires (~1 sprint)
**Objectives:** protect refactors; capture baselines.
- Add snapshot tests: nav role filtering, StatusBadge mapping, ResponsiveTable API (UX-015, part of UX-070 prep).
- Capture visual baselines (screenshots) of 10 key pages light+dark.
- Write payment parity matrix (input to UX-080).
- ESLint groundwork analysis for bans (no activation yet).
**Risk:** low. **AC:** tests added green; matrices reviewed.

## Phase 1 — Critical Legibility & Reachability (P0 quick wins)
- UX-030 micro-type elimination; UX-100-interim links to orphaned pages.
**Files:** ~40 files mechanical + financial hub header links.
**AC:** zero `text-[8..11px]`; every route reachable by its role; visual diff review.

## Phase 2 — Design Tokens Sweep
- Color sweeps UX-021..026 (+dark tokens UX-020); type weight/scale UX-031.
**Dependencies:** Phase 1 done. **AC:** grep allow-lists met; contrast pass (A3); brand continuity screenshots approved.

## Phase 3 — Navigation & Headers
- UX-010/011 nav config+sidebar; UX-032/033 PageHeader rewrite+migration; UX-012/013 header decluster/breadcrumbs; UX-014 command palette decision implementation.
**AC:** nav snapshot green; single-H1 audit passes; all pages via PageHeader.

## Phase 4 — High-Impact Flows (P0 core)
- UX-080/081 unified payment (build → re-point → parity sign-off → delete legacy).
- R2/UX-083 customers decomposition + detail tabs (UX-085 overlay standards applied here).
**Dependencies:** parity matrix (P0); FormKit can land in parallel (UX-060).
**AC:** golden-flow payment script per entry point × roles; customers boolean-state ≤3; no nested dialogs.

## Phase 5 — Tables Wave
- UX-070 kit extension, UX-071 StatusBadge, migrations UX-072..078 in canonical order.
**AC:** per-table checklist (doc 10); mobile card verified 375px; no data loss.

## Phase 6 — Forms & Money Surfaces Polish
- UX-061..065 form migrations; IA-1 full tabs merge if BD-1 resolved (else defer); debt-center drawer UX-082; dashboard tasks UX-050..054.
**AC:** form parity docs complete; dashboard hierarchy review approved.

## Phase 7 — Responsive & Reports
- UX-090..094; report toolbar kit + per-report adoption; daily-sales placement per BD-2.
**AC:** responsive acceptance list (doc 12) passes.

## Phase 8 — Accessibility & Consistency Final Pass
- A2/A4/A5/A6/A10 remediation checks; de-decoration/density/radius sweeps UX-040..042/045; notification deletions UX-084; ESLint bans activation UX-035.
**AC:** keyboard-only scripts; contrast AA; banned-utility greps clean; reduced-motion respected.

## Phase 9 — Regression & Closure
- Full test suite + golden flows × roles; baseline screenshot comparison; findings log closure mirroring prior program style; documentation updates (README testing section gains UX test notes).

## Dependency graph (condensed)
```
P0 ─→ P1 ─→ P2 ─→ P3 ─┬─→ P5 ─→ P7
                       ├─→ P4 (needs P0 matrix; parallel with P3)
                       └─→ P6 (needs P4 for payment tab)
P7/P6 ─→ P8 ─→ P9
```

## Effort sketch
| Phase | Size |
|---|---|
| 0 | S |
| 1 | S-M |
| 2 | M (mechanical, broad) |
| 3 | M |
| 4 | L (highest risk) |
| 5 | L |
| 6 | M-L |
| 7 | M |
| 8 | M |
| 9 | S |

## Rollback strategy
Phase branches stacked; any phase revertible independently; deletions only post-parity; feature-flag not required since changes are presentational and gated by review scripts.
