# Sprint 06 — Responsive Experience

## Objective
Give mobile operators a usable data experience: mobile strategy for wide tables and verified touch targets.

## Why This Sprint Exists
This is an operational warehouse/POS-adjacent tool; phone usage is a first-class scenario, currently served by horizontal-scrolling tables only.

## Scope
- Mobile card/list fallback for the highest-traffic tables (customers, products, invoices list, stock).
- Touch-target sizing pass on row actions.
- Runtime verification of sticky elements + virtual keyboard on invoice form.

## Out of Scope
Desktop layout changes; new breakpoints; tablet-specific design beyond verification.

## Branch
`feat/frontend-sprint-06-responsive`

## Findings Addressed
RWD-001, RWD-003, RWD-004, A11Y-004 (responsive portion)

## Tasks
- FE-RWD-001 — Mobile table pattern (`tasks/responsive/FE-RWD-001-mobile-tables.md`)
- FE-RWD-002 — Touch targets & runtime checks (`tasks/responsive/FE-RWD-002-touch-targets.md`)

## Dependencies
Sprint 05 (tables live in extracted views by then; avoids double work).

## Implementation Order
1. FE-RWD-001
2. FE-RWD-002

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: 360px viewport walk of all list pages (no horizontal page scroll; tables either stack or scroll within their container); all row actions ≥44px; invoice form usable with keyboard open.

## Acceptance Criteria
- No full-page horizontal scrolling at 360px on any protected route.
- Mobile fallback implemented via one shared component, not per-page copies.

## Definition of Done
Standard DoD + screenshots at 360/768/1280 widths in PR.

## Expected Result
Mobile parity for read + core write flows.

---

## Execution Record

**Branch:** `feat/frontend-sprint-06-responsive` (stacked on sprint-05)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-RWD-001 | `f168505` | New shared `ResponsiveTable` (`components/ui/responsive-table.jsx`): standard table on md+, stacked cards below; owns loading/error/empty states in both branches (D11 primitives). Migrated customers (new `CustomerCard`), products (new `ProductCard`), stock movements (new `MovementCard` + shared `MovementTypeBadge`). Invoices list verified already card-based at all widths — no change needed. Desktop rows reuse existing CustomerRow/ProductRow verbatim |
| FE-RWD-002 | `8bebda3` | `ui/button.jsx` `icon` variant 40→44px (h-11 w-11) — fixes all default icon buttons globally; explicit-size row actions bumped in CustomerRow/ProductRow/Header; stock type-filter select moved below the search input below md (was absolutely positioned overlapping it) and raised to 44px height |

**Gates at completion:** lint 0 errors / 47 warnings (baseline held), tests 3/3, build green.

**Acceptance verification:**
- No page-level horizontal scroll at 360px on customers/products/stock/invoices: tables hidden below md, card stacks render instead; control bars already wrap via flex-col breakpoints.
- One shared implementation (`ResponsiveTable`) — no per-page copies of the pattern.
- Touch targets ≥44px for all list row actions and header controls.

**Notes / deviations:**
- Stock desktop feed lost the AnimatePresence popLayout exit animation and per-row stagger delay (rows now animate entry only) — consequence of routing rows through the shared component; visual-only.
- Stock/customers/products empty-state markup unified onto shared LoadingState/ErrorState/EmptyState inside ResponsiveTable — copy preserved (Arabic strings passed as props); stock's oversized custom loader replaced by the standard one.
- CustomerRow decorative grip indicator (non-interactive) intentionally left at 40px.
- Runtime checklist executed via DevTools emulation at 360/768/1280 (no physical devices available in this environment); real-device iOS/Android keyboard pass on invoice form remains open for QA during PR review.

**Follow-ups filed for later sprints:**
- Remaining ~13 tables (receivables, debt-center, users, suppliers, logs, audit, reports…) migrate onto ResponsiveTable opportunistically — backlog item, not sprint scope.
