# Sprint 02 — Data Layer & State Management

## Objective
Make the fetch layer correct (dedup, cancellation, expiry-ready hooks), unify endpoint contracts, and stop unauthenticated polling.

## Why This Sprint Exists
The fetcher is the single most-shared module; its bugs (DATA-001/002/004) amplify into every page. Contracts must be centralized before god-page decomposition so extracted components call stable service functions.

## Scope
- Fix deduplication semantics in `api-utils.js` (GET dedup yes, mutation coalescing no).
- Add timeout + AbortSignal plumbing to `fetcher`; wire React Query signals.
- Centralize endpoint URLs + JSDoc response contracts into services; migrate hooks.
- Unified mutation success/error toast policy helper.
- Gate notification polling on session presence.
- Fix `useUserRole` shape handling + query config drift.

## Out of Scope
401 redirect behavior (Sprint 03 — needs auth UX decisions); any UI changes beyond toasts standardization; form patterns.

## Branch
`feat/frontend-sprint-02-data-state`

## Findings Addressed
DATA-001, DATA-002, DATA-003, DATA-004, DATA-005, STATE-001, ARCH-002

## Tasks
- FE-DATA-001 — Fix inverted deduplication (`tasks/data/FE-DATA-001-dedup-fix.md`)
- FE-DATA-002 — Timeout + cancellation (`tasks/data/FE-DATA-002-timeout-abort.md`)
- FE-DATA-003 — Toast/error policy helper (`tasks/data/FE-DATA-003-toast-policy.md`)
- FE-DATA-004 — Auth-gated polling (`tasks/data/FE-DATA-004-auth-gated-polling.md`)
- FE-DATA-005 — Service contracts consolidation (`tasks/data/FE-DATA-005-service-contracts.md`)
- FE-STATE-001 — useUserRole correctness (`tasks/state/FE-STATE-001-user-role-shape.md`)

## Dependencies
Sprint 01 (error surfaces catch regressions). FE-DATA-005 after 001–003 stabilize the fetcher.

## Implementation Order
1. FE-DATA-001
2. FE-DATA-002
3. FE-STATE-001
4. FE-DATA-004
5. FE-DATA-003
6. FE-DATA-005

## Validation
```bash
pnpm run lint && pnpm test && pnpm run build
```
Manual: double-click a delete → exactly one request (network tab); throttle API → requests abort on unmount; logged-out /login → zero `/api/notifications` calls.

## Acceptance Criteria
- Identical concurrent GETs share one request; identical concurrent mutations do NOT silently merge.
- All queries/mutations pass abort signals; hung backend resolves via timeout error path.
- One module owns each endpoint URL string.
- No polling while logged out.

## Definition of Done
Standard DoD.

## Expected Result
Data layer is predictable and observable; pages can be decomposed safely next.

---

## Execution Record

**Branch:** `feat/frontend-sprint-02-data-state` (stacked on sprint-01)
**Status:** COMPLETE

| Task | Commit | Summary |
|---|---|---|
| FE-DATA-001 | `97b82b3` | Dedup now GET-only; mutation coalescing removed; verified no callers used `skipDeduplication` |
| FE-DATA-002 | `a8cafd6` | Composed AbortController (caller signal + 30s default, overridable); timeout → `JammazApiError` 408 with `isTimeout`; external-signal requests skip dedup; all queryFn sites (~40) pass `{ signal }` |
| FE-STATE-001 | `78e6404` | `const user = data ?? null`; misleading comments/dead vars/console logs removed; config deviation documented (ADR-style comment) |
| FE-DATA-004 | `81e3b87` | Notifications query gated on `enabled: !!user` via shared `['user-session']` cache |
| FE-DATA-003 | `dde9d98` | `src/lib/mutation-feedback.js` (`withMutationFeedback`); 10 hook files migrated, Arabic copy verbatim; policy recorded as Decision **D10** in target.md |
| FE-DATA-005 | `577488f` `2cbf5e6` `265290d` `50f3af6` `f8c6fc3` `f16d800` | Per-domain commits: customers/products → suppliers/users/auth → invoices/returns/stock/POs → financial → dashboard/notifications/physical-inventory/accounting → reports/daily-sales. Zero `@/lib/api-utils` imports outside services/lib |

**Gates at completion:** lint 0 errors / 54 warnings (baseline), tests 3/3, build green.

**Notes / deviations:**
- Dead-code service modules that pointed at non-existent endpoints (`purchaseOrderService` → `/api/purchases`, treasury variants) were rewritten onto the real endpoints consumed by the UI rather than deleted (deletion belongs to Sprint 10 cleanup).
- Timeout Arabic message uses `'انتهت مهلة الاتصال بالخادم'` (distinct from generic `'خطأ في الاتصال بالخادم'`) for diagnosability.
- Legacy `XxxService` namespace objects retained alongside named exports for any untracked consumers.

**Follow-ups filed for later sprints:**
- Raw-fetch remnants audited — none remain; all pages consume services.
- `useInvoiceItems` validation toasts and `useMutationLock` warning intentionally out of scope (FE-FORM-001 / lock UX).
