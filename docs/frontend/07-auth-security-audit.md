# 07 — Authentication & Frontend Security Audit

## Auth Flow (as implemented)

1. `POST /api/auth/login` → backend sets httpOnly `token` cookie → client redirects to `/` (`login/page.jsx:36`).
2. Page-route protection: `middleware.js` verifies cookie JWT (jose) for all non-public paths; unauthenticated page requests → 302 `/login`; API requests → 401 JSON.
3. Client session knowledge: `useUserRole()` → `GET /api/auth/session`, cached 5 min.
4. Logout: `POST /api/auth/logout` then hard redirect to `/login` (`useHeader.js:22-30`) — fallback also redirects on failure ✅.

**Security positives:** token never in localStorage/sessionStorage/JS-readable cookie; no secrets in client env (`NEXT_PUBLIC_API_URL` only); no `.env` committed; login has **no open-redirect vector** (hardcoded destinations; no `redirect=`/`next=` param handling anywhere).

## Findings

### AUTH-001 — Session Expiry Is Invisible (HIGH)
Middleware only guards *navigations*. An expired session during usage gets silent 401s from the fetcher (`api-utils.js:103-108` no-op) — user sees raw error toasts, data stops loading, no path back to login. Remediation FE-AUTH-001. *(Frontend Integration Issue: backend refresh-token behavior unknown from this repo; frontend action = handle 401 globally regardless.)*

### AUTH-002 — Authorization UX Is Shallow and Buggy (HIGH)
- Middleware authenticates but never authorizes; any role can load `/users`, `/settings` pages.
- UI checks are per-page hand-rolls, not a shared guard: `users/page.jsx:16-17` (`canManage = owner||manager`, `canDelete = owner`), `audit/page.jsx:18`.
- **Bug:** `audit/page.jsx:18` checks `role === 'admin'` — `'admin'` does not exist in `ROLES` (`lib/permissions.js`: owner/manager/cashier/warehouse/viewer). Either dead condition or wrong string.
- Navigation hides items via permission strings (`config/navigation.js`) but deep links remain reachable in UI (backend enforcement assumed — Frontend Integration Issue).
Remediation FE-AUTH-002: `<RoleGate>` component + route-group guard + fix phantom role.

### SEC-001 — Sensitive Data in Logs (HIGH)
| Location | Leak |
|---|---|
| `middleware.js:23` | every request path + token presence |
| `middleware.js:30` | `userId` + `role` on every verified request |
| `login/page.jsx:31` | entire login response object |
| `useUserRole.js:10` | full session response on every fetch |
Mitigated partially by `removeConsole` in prod build config — but that only strips console.* in bundled client code, **not middleware** (edge runtime, separate bundle). Remediation FE-SEC-001.

### SEC-002 — innerHTML Print Hack (MEDIUM)
`PartnerTransactionDialog.jsx:39-43`: saves `document.body.innerHTML`, replaces it with `#print-area` HTML, prints, restores, then `window.location.reload()` to resuscitate React. Destroys the React tree, discards all client state, renders unsanitized markup. Other print flows use bare `window.print()` with (presumably) print CSS. Remediation FE-SEC-002.

### SEC-003 — `window.open` Without `noopener` (LOW)
`customers/[id]/CustomerClient.jsx:374` — internal URL, `_blank`, no features arg. Hardening only. FE-SEC-003.

### SEC-004 — shadcn Chart Style Injection (INFO)
`ui/chart.jsx:66-81` uses `dangerouslySetInnerHTML` for themed CSS variables — standard shadcn pattern; colors come from developer config, not user input. No action required beyond awareness.

### Cleared Checks (no evidence of issue)
- No `eval`/`new Function`; no `target="_blank"` anchors; no `JSON.parse` without guard; no committed `.env*`; no `NEXT_PUBLIC_*` secrets; sidebar cookie write is benign UI state.

> Backend enforcement of permissions is out of scope; frontend must not treat hidden nav items as authorization (see AUTH-002).
