# Current Architecture (as audited)

## Rendering & Routing
- Next.js 16 App Router; 40/41 pages are client components; single server page wraps a client view.
- Root layout mounts: ThemeProvider → QueryProvider → NotificationProvider → children + LazyNotificationCenter + Toaster.
- Protected shell `(protected)/layout.jsx`: SidebarProvider + Sidebar + Header + scrollable main container.

## Data Flow
```
UI components
   ↓
feature hooks (src/hooks/*)          ← TanStack Query (keys like ['customers', ctx])
   ↓ (mostly inline URLs)              (some go through src/services/* — inconsistent)
api.* / fetcher  (src/lib/api-utils.js)
   ↓ same-origin /api/*
middleware.js (jose JWT verify, cookie 'token')
   ↓ rewrite (next.config.mjs)
external backend  API_PROXY_TARGET (default http://127.0.0.1:5050)
```

## Auth
- Login: POST /api/auth/login → httpOnly cookie → redirect '/'.
- Route guard: middleware (authn only, all roles pass).
- Session knowledge: `useUserRole` query `['user-session']`, staleTime 5min, focus-refetch on.
- Role checks: ad-hoc string comparisons per page + navigation permission filtering.

## State Ownership (actual)
| State | Owner |
|---|---|
| Server data | TanStack Query cache |
| Session | ['user-session'] query |
| Sidebar/UI | SidebarProvider context |
| Notifications | NotificationContext (root-mounted poll 30s) |
| Filters | useFilters local state (6 other pages: URL params) |
| Forms | per-dialog useState |

## Known Structural Debt (mapped to findings)
- God pages ×5 (ARCH-001) · dead backend lib layer (ARCH-003) · selector triplication (COMP-001) · dual chart libs (PERF-002) · no global error surfaces (ERR-001) · fetcher dedup inversion (DATA-001) · silent expiry (AUTH-001).
