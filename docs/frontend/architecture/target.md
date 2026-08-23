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
