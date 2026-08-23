# Frontend Data Flow (current → target)

## Session flow
```
login page → AuthService.login → POST /api/auth/login
  → Set-Cookie: token (httpOnly) → redirect '/'
middleware: every navigation verifies cookie JWT (jose) — authn only
client session: useUserRole → GET /api/auth/session → ['user-session'] cache
logout: POST /api/auth/logout → hard redirect '/login'
```
Target delta: fetcher reacts to 401 globally (clear cache → /login?expired=1); RoleGate consumes the same cache; polling gated on session.

## Read flow
```
component mount → useQuery(queryKey, () => service.getX(params))
  → fetcher GET (+dedup, +timeout, +signal) → backend
  → {success,data} envelope unwrapped by fetcher → component renders via state primitives
```

## Write flow
```
form (RHF+zod) → mutateAsync wrapped by feedback helper
  → service.mutate → api.post/put/delete (never coalesced)
  → success: invalidate domain keys + success toast
  → 400 field errors: JammazApiError.data → form fields
  → 401: global redirect · 403: forbidden feedback
```

## Notification flow
```
session exists? ──no──▶ no requests
       │yes
GET /api/notifications every 30s (visible tab only)
action → mark-read PATCH → invalidate ['notifications'] → optional router.push(notif.link)
```

## Print flows (target)
All printing via `@media print` CSS regions + `window.print()`; no DOM swap, no reload.
