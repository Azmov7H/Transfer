# Target Architecture (post-remediation)

Decisions codified by FE-ARCH-002 ADR; this file is the reference summary.

## Principles
1. **Client-first is retained.** TanStack Query stays the server-state engine. RSC adoption is opportunistic and measurement-gated (FE-PERF-003), never wholesale.
2. **Layered data access, enforced:** `UI → hooks → services → api fetcher`. No `api` imports in pages/components; no endpoint strings outside services; each endpoint documented once with JSDoc typedefs.
3. **One primitive per concept:** single ProductSelector, ConfirmDialog (Radix AlertDialog), Loading/Empty/Error/Unauthorized states, one chart library, one form pattern (RHF + zod + explicit isSubmitting).
4. **Authorization UX via RoleGate + permissions lib** — zero stringly-typed role comparisons; hiding UI is never treated as enforcement.
5. **Failure is always visible and recoverable:** root/global error boundaries, Arabic 404, global 401 redirect, timeout on every request.

## Target Data Flow
```
pages (composition only)
   ↓
feature views (src/components/<domain>/*)      ← presentation + UI state only
   ↓
domain hooks (src/hooks/*)                     ← query keys from key factory
   ↓
services (src/services/*)                      ← URL builders + @typedef contracts
   ↓
fetcher (src/lib/api-utils.js)                 ← GET dedup · timeout · signal · 401 redirect
   ↓ /api/* → middleware → backend
```

## State Ownership (target)
| State | Owner |
|---|---|
| Server data | TanStack Query |
| Session | ['user-session'] query (single consumer hook, honest shape) |
| Filters | useFilters with URL sync (all list pages) |
| Forms | RHF + zod per FE-FORM-001 |
| UI shell | SidebarProvider / NotificationContext (auth-gated poll) |

## Dependency Graph (module-level)
```
lib/api-utils  ← services ← hooks ← components ← pages
lib/permissions ← RoleGate ← protected layouts/pages
validations (zod) ← forms (RHF adapter)
utils/index.js ← everything (leaf: cn, formatters — single source)
```
No cycles; utils/validations/lib are leaves.

## Non-Goals
TypeScript migration (deferred, ladder documented in 12-typescript-audit.md) · Tailwind 4 · E2E framework (documented future work) · Redux/zustand.

---

# Decision Log

| # | Decision | Rationale | Consequences | Status |
|---|---|---|---|---|
| D1 | Client-first rendering retained; TanStack Query stays the server-state engine | Existing investment is sound; RSC conversion only on measured wins (FE-PERF-003) | Next.js server capabilities used for metadata/boundaries only | Accepted |
| D2 | Layered data access enforced: UI → hooks → services → fetcher | Single source of truth per endpoint contract (ARCH-002/DATA-005) | `api` imports outside services/lib become violations; grep-enforced in Sprint 02 | Accepted |
| D3 | One primitive per UI concept (selector, confirm dialog, state primitives, chart lib, form pattern) | Eliminates drift (COMP-001, UX-001) | Legacy duplicates deleted in Sprint 10 | Accepted |
| D4 | Authorization UX via `<RoleGate>` + permissions lib only | Phantom-role bug class (AUTH-002); stringly comparisons banned | Hidden nav items are never treated as enforcement | Accepted |
| D5 | Failure is always visible and recoverable | ERR-001/AUTH-001 | Root error.jsx, global-error.jsx, Arabic not-found.jsx shipped in Sprint 01; global 401 redirect lands Sprint 03 | Implemented |
| D6 | Package manager is **pnpm**, pinned via `packageManager` field | Matches install reality; ended DX-001 split-brain | npm lockfile removed; installs via pnpm only | Implemented |
| D7 | ESLint runs native flat config; new react-hooks v7 compiler rules downgraded to **warn** until their refactors land | Baseline gate must be runnable without behavior change | Warnings are tracked remediation targets mapped to Sprints 02/04/05; must not be re-downgraded after their sprint completes | Transitional |
| D8 | `components/ErrorBoundary.jsx` is retired | Route-level boundaries (root/segment/global-error) now cover all recovery paths; widget-level isolation has no current consumer | Deletion scheduled in FE-CLEAN-002 (Sprint 10) | Decided |
| D9 | Internal tool: `robots: noindex`, no OG/sitemap/structured data | Public discoverability irrelevant (SEO-001) | Per-section Arabic titles shipped instead | Implemented |
| D10 | All mutation feedback flows through `withMutationFeedback()` (`src/lib/mutation-feedback.js`): server `error.message` first, domain Arabic fallback second; success copy passed per-mutation, never hand-rolled in hooks | One documented policy ends toast drift (DATA-003/ERR-002) | Existing Arabic strings migrated verbatim; validation/lock warnings (useInvoiceItems, useMutationLock) stay out of scope; native alerts remain FE-UX-001 | Implemented |
| D11 | Content states use the four primitives exclusively: `LoadingState`/`ErrorState`/`EmptyState` (`components/common/`) + `<RoleGate>` unauthorized. EmptyState API: `{icon?, title?, hint?, action?{label,onClick,icon?}, children}`; table variants `Table*State({colSpan, ...})`. Pages adopt per FE-PAGES-005; shared/dialog components must not hand-roll spinners or blank bodies | One vocabulary for every surface state (COMP-002) | Existing Arabic copy preserved verbatim during migration | Implemented |
