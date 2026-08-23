# 06 — Data Layer Audit

## Architecture

Single fetch wrapper `src/lib/api-utils.js` (`fetcher` + `api.get/post/put/delete/patch`) → same-origin `/api/*` → `next.config.mjs` rewrite → external backend. TanStack Query consumes it. `credentials:'include'` default; cookie-based auth means no token handling in JS (good).

## Findings

### DATA-001 — Request "Deduplication" Targets Mutations, Not Reads (HIGH)
`api-utils.js:66-73`:
```js
const mutationMethods = ['POST', 'PUT', 'DELETE', 'PATCH'];
const shouldDeduplicate = !skipDeduplication && mutationMethods.includes(fetchOptions.method);
if (shouldDeduplicate && pendingRequests.has(requestKey)) {
    return pendingRequests.get(requestKey).promise;
}
```
- GETs — the requests that actually benefit from deduplication — are never coalesced.
- Concurrent **identical mutations** share one promise: two rapid "add invoice line" clicks with identical bodies silently become one request. As an accidental double-submit guard it works, but as designed behavior it's dangerous (a DELETE and a retry of a failed POST with the same URL+body string would also collide via the key `${method}:${url}:${body}` — method differs, but two intentional identical DELETEs would merge).
- No timeout on pending entries beyond the in-flight promise itself.
Remediation FE-DATA-001: invert to GET deduplication; make mutation double-submit protection explicit at form/mutation layer.

### DATA-002 — No Timeouts, No Cancellation (MEDIUM)
No `AbortController`, no `signal`, no timeout anywhere in `src/`. React Query provides its own signal support that is unused (`queryFn` never accepts `{signal}`). Slow/hung backend = indefinite spinners. Remediation FE-DATA-002.

### AUTH-001 — 401/403 Handling Is a Commented-Out No-Op (HIGH)
`api-utils.js:103-108`: on 401/403 the code does nothing (redirect line commented: *"Uncomment when routing is ready"*). After session expiry users remain on pages where every action fails with raw error toasts; no redirect to `/login`. Remediation FE-AUTH-001 (Sprint 03).

### DATA-003 — Endpoint Contracts Duplicated Across Hooks (MEDIUM)
URLs like `/api/customers`, `/api/treasury`, `/api/debts` are hardcoded in hooks AND services modules exist for some of the same endpoints (`services/customerService.js` vs `useCustomers.js`). Two sources of truth. Remediation FE-DATA-005 + key factory FE-STATE-005-task (folded into FE-DATA-005).

### DATA-004 — Notification Polling Runs Unauthenticated (MEDIUM)
`NotificationProvider` mounts in root layout; `useNotifications` polls `GET /api/notifications?limit=20` every 30s (`refetchInterval:30000`) regardless of auth state. On the login page / after logout this produces perpetual 401 retries (with global `retry:3` per poll). Remediation FE-DATA-004: enable polling only when session exists.

### DATA-006 — Inconsistent Error Surfacing From Mutations (MEDIUM)
Some hooks toast on error (`useCustomers.js:24-26`), others leave errors to components, others swallow (`authService.getSession` returns null). No shared policy. Remediation FE-DATA-003.

### Positives
- Response unwrapping (`{success,data}`) centralized; `JammazApiError` carries status/data cleanly.
- Query keys include filter contexts (`['customers', queryContext]`) — invalidation is coarse (`['customers']`) but correct.
- Search debounce (500ms) prevents request storms on list search inputs.
