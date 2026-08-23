# Sprint 05 — Pages & Feature UX

## Objective
Decompose the five god pages into feature views + hooks, complete UI-state coverage per page, and standardize filter state.

## Why This Sprint Exists
The largest maintainability and UX-correctness wins live here; with Sprints 02–04 tooling ready, extraction is mechanical rather than risky.

## Scope
- financial, settings, accounting, physical-inventory/[id], invoices/[id] decompositions.
- Per-page state matrix (initial/loading/success/empty/error/unauthorized) completed for all list pages.
- URL-backed filters for list pages via extended useFilters.
- Unsaved-changes guard on invoice creation.

## Out of Scope
New features; visual redesign; backend changes.

## Branch
`feat/frontend-sprint-05-pages-ux`

## Findings Addressed
ARCH-001, COMP-003, FORM-001 (rollout), FORM-002, STATE-003, UX-002, COMP-002 completion

## Tasks
- FE-PAGES-001 — Decompose financial page (`tasks/ux-ui/FE-PAGES-001-financial.md`)
- FE-PAGES-002 — Decompose settings page (`tasks/ux-ui/FE-PAGES-002-settings.md`)
- FE-PAGES-003 — Decompose accounting page (`tasks/ux-ui/FE-PAGES-003-accounting.md`)
- FE-PAGES-004 — Decompose detail pages + guards (`tasks/ux-ui/FE-PAGES-004-detail-pages.md`)
- FE-PAGES-005 — UI-state completeness + URL filters (`tasks/ux-ui/FE-PAGES-005-ui-states.md`)

## Dependencies
Sprints 02, 03, 04 — strictly. Do not start extraction before primitives exist.

## Implementation Order
1. FE-PAGES-002 (lowest traffic — safest pilot)
2. FE-PAGES-003
3. FE-PAGES-001
4. FE-PAGES-004
5. FE-PAGES-005

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: full regression walk of each decomposed flow (create/edit/delete/print per entity); refresh-with-filter preserves state on migrated list pages; leaving half-filled new-invoice prompts confirmation.

## Acceptance Criteria
- No page file >300 lines; each extracted view/hook has a single responsibility.
- Every list page renders defined empty/error/unauthorized states.
- Behavior parity confirmed against pre-refactor build for all five pages.

## Definition of Done
Standard DoD + side-by-side manual regression notes in PR.

## Expected Result
Feature code is reviewable in isolation; state coverage gaps closed.

---

## Execution Record

**Branch:** `feat/frontend-sprint-05-pages-ux` (stacked on sprint-04)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-PAGES-002 | `18985b5` | Settings split into 5 tab components (`components/settings/`) + `TabHeader`; new `settingsService` + `useInvoiceSettings` hook; page.jsx composition-only (697→~120 lines). Lint warnings dropped 55→49 (render-time TabHeader creation eliminated) |
| FE-PAGES-003 | `aa35aba` | Accounting split into StatisticsDashboard / FiltersBar / JournalEntriesTab / LedgerTab / TrialBalanceTab under `components/accounting/`; LedgerTab render-phase setState converted to useEffect; page composition-only |
| FE-PAGES-001 | `4603ada` | Financial split into TreasuryStatsCards / TransactionsTable / TransactionDetailsDialog / AddTransactionDialog; dead code removed (fetchDailyDetails + daily state never rendered); 882-line god page → 287-line composer |
| FE-PAGES-004 | `bc6180b` `27c600c` | physical-inventory/[id] → CountHeader/CountStatsDashboard/ScannerBar/CountItemsTable/UnsavedChangesToast; invoices/[id] → InvoiceReturnDialog + InvoicePrintView; new `useUnsavedGuard` (beforeunload + link-capture + popstate) wired into invoices/new, disarmed on successful create |
| FE-PAGES-005 | `98d5f3c` | useFilters extended with URL sync (`q`/`filter`/`page`, replace not push); state matrix produced at `docs/frontend/architecture/state-matrix.md` — all list pages show loading/error/empty coverage |

**Gates at completion:** lint 0 errors / 47 warnings (down from 55 baseline — decompositions eliminated several compiler-rule warnings), tests 3/3, build green.

**Notes / deviations:**
- All extractions moved JSX verbatim; behavior parity preserved except: LedgerTab default-account selection now runs in an effect instead of during render, and the financial daily-details dead state was deleted.
- invoices/[id] keeps its raw-fetch data flow (returns/settings/invoice triple-fetch with partial-success semantics) — service consolidation for this page deferred to Sprint 10 cleanup to avoid changing the reload-on-return behavior mid-decomposition.
- useUnsavedGuard uses native confirm for in-app navigation blocking (App Router has no router-event interception API without wrapper components); beforeunload covers tab close. Disarmed after successful invoice creation.

**Follow-ups filed for later sprints:**
- audit + logs pages remain raw-fetch legacy surfaces — Sprint 10 cleanup candidates.
- Remaining dialogs migrate onto FE-FORM-001 pattern opportunistically as they are touched.
