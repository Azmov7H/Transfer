# 05 — State Management Audit

## State Classification

| Kind | Where | Assessment |
|---|---|---|
| Server state | TanStack Query (24 hooks) | ✅ correct tool, mostly consistent keys |
| Auth state | `useUserRole` query (`['user-session']`) + httpOnly cookie | ⚠ shape confusion (STATE-001), no expiry reaction (AUTH-001) |
| UI state | SidebarProvider context, NotificationContext sidebar bool, local `useState` | ✅ appropriately scoped |
| Form state | hand-rolled `useState` per dialog | ❌ inconsistent (FORM-001) |
| URL state | `useSearchParams` in 6 pages (report filters, receivables customerId, debt autoPay) | ⚠ partial adoption — most list pages keep filters in memory only |
| Derived state | computed inline in render | ✅ not over-stored |
| Persistent state | none (no localStorage/sessionStorage anywhere — good for security) | ✅ |

## Findings

### STATE-001 — useUserRole Data-Shape Handling Is Accidental (MEDIUM)
`src/hooks/useUserRole.js:22-27`:
```js
// Handle data extract from { success: true, data: { ...user } }
const responseData = data;
const user = responseData || null;
const role = user?.role || null;
```
The comment describes an unwrapping that **already happens** inside `api-utils.js:126-128` (fetcher unwraps `{success,data}` → returns `data`). The code works only because the wrapper pre-unwraps. The dead variables and misleading comment make this fragile — if anyone "fixes" either side to match the comment, role detection breaks everywhere. Remediation FE-STATE-001.

### STATE-002 — Query Config Drift Between Defaults and Consumers (LOW)
Global defaults: `staleTime 60s`, `refetchOnWindowFocus:false`, `retry:3` (QueryProvider.jsx:17-20).
`useUserRole` overrides: `staleTime 5min`, `refetchOnWindowFocus:true` → session refetches on every tab focus; combined with Header + pages both consuming the hook it's fine (shared cache), but the inconsistency is undocumented intent. Fold into FE-STATE-001.

### STATE-003 — Filter/URL State Split-Brain (LOW)
`useFilters.js` keeps search/page/limit in component state only; six other pages read filters from `useSearchParams`. Result: refreshing a customers/products list loses its filter state while reports preserve theirs. Standardize in FE-PAGES-005.

### STATE-004 — Mutation Lock Hook Exists, Barely Used (VERIFY)
`hooks/useMutationLock.js` exists as a double-submit guard; most dialogs instead rely on Radix modal semantics or nothing. Verify consumers; either adopt systematically (with FE-FORM-001 pattern) or delete in Sprint 10.

## Ownership Recommendations

1. Session/user: single `['user-session']` query — already shared ✅; just fix shape handling.
2. Notifications: keep in provider, but gate polling on auth (FE-DATA-004).
3. Filters: standardize on one strategy (recommend URL params for list pages) — FE-PAGES-005.
4. No new global stores needed. Redux/zustand would be over-engineering here.
