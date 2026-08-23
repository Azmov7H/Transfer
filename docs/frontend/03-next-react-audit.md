# 03 — Next.js / React Architecture Audit

## Rendering Model

### NEXT-001 — Next.js Used as a Client SPA (HIGH)
- 106 files with `"use client"`; 40 of ~41 `page.jsx` files are client components.
- Zero server-side data fetching; no server actions; no streaming/Suspense data boundaries.
- Consequences: full client JS for every screen, an extra `/api/auth/session` round-trip on first paint before role-aware UI resolves, and no ability to leverage RSC caching.
- Root cause: app was likely migrated from CRA-era patterns; hooks-first habits.
- Impact: slower cold start on low-end devices (this is an Arabic-market SMB tool), larger bundle, avoidable auth flash.
- Recommendation: progressive, not big-bang. Convert leaf list pages' initial fetch to server components where the query is static per-navigation, or at minimum keep client model but remove the double render flash. Tracked as FE-NEXT-001 (metadata/boundaries) + evaluated further in Sprint 08. **Do not force RSC conversion wholesale** — the TanStack Query investment is sound.

## Boundaries

### NEXT-002 — Server/Client Boundary Is Correct Where It Exists (INFO)
`customers/[id]/page.jsx` (server) → `CustomerClient.jsx` (client) is the only true boundary and is correctly shaped. No `"use client"` misuse found in `lib/`, `validations/`, or config files (they are server-safe by default).

### NEXT-003 — Providers All Live in Root Layout (MEDIUM)
`layout.jsx` mounts ThemeProvider + QueryProvider + NotificationProvider + LazyNotificationCenter + Toaster for **all** routes including login. Notification polling therefore starts pre-auth (see DATA-004). SidebarProvider correctly scoped to `(protected)/layout.jsx`.

## Loading / Error / Not-Found Coverage

### ERR-001 — Missing Global Error Surfaces (CRITICAL)
Existing: `app/loading.jsx`, `(protected)/loading.jsx`, `(protected)/error.jsx`.
Missing: root `app/error.jsx`, `app/global-error.jsx`, `app/not-found.jsx`.
An uncaught render error on any `(public)` route — or an error thrown by the protected layout itself — produces a blank screen with no recovery UI. `src/components/ErrorBoundary.jsx` exists (with dev detail panel) but is imported nowhere.
Remediation: FE-ARCH-001.

### NEXT-004 — Route-Level Metadata Absent (MEDIUM)
Only `app/layout.jsx:16` exports metadata (static Arabic title/description). No per-page titles, no template (`%s | مخازن الجماز`), no OG/Twitter, no robots/sitemap. For an authenticated internal tool this is LOW user impact but trivial to improve; browser tab shows identical title everywhere. Remediation: FE-NEXT-001.

## Hydration

### STATE-002 — Hydration-Sensitive Initializers (LOW)
- `financial/page.jsx:24-27`: `useState({ startDate: new Date().toISOString()… })` runs during SSR too; midnight-boundary mismatch possible.
- Date formatting uses `Intl` with explicit `ar-EG` locale (deterministic) — good; no `toLocaleDateString()` without locale found.
- `suppressHydrationWarning` correctly present on `<html>` for next-themes.
Risk assessed LOW; fix opportunistically in FE-PAGES-001.

## Middleware Interaction

- `middleware.js` verifies the `token` cookie via jose and redirects unauthenticated page requests to `/login`; API requests get 401 JSON. Matcher excludes `_next/static`, `_next/image`, favicon, login, public.
- **Gap:** matcher does not exclude `icon.png`/other static assets served from app dir; harmless.
- Middleware performs authentication only — **no route-level authorization** (any valid session can load `/users` page HTML; protection depends on backend API enforcement). Frontend must add its own guard UX: FE-AUTH-002.
