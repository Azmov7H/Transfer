# 00 — Audit Scope

## In Scope (frontend only)

- Next.js 16 App Router application under `src/app/**`
- All React components under `src/components/**`
- Hooks (`src/hooks/**`), providers/context (`src/providers`, `src/context`)
- Data-fetching layer as consumed by the frontend: `src/lib/api-utils.js`, `src/services/**`
- Client-side auth UX: login page, session hook, role-aware UI, logout
- Middleware `src/middleware.js` (edge route protection — frontend routing concern)
- Styling system, design tokens, responsive behavior, accessibility
- Frontend security surface (XSS vectors, web storage, logging, env exposure)
- Build/lint/test tooling, dependencies, package management, DX scripts

## Out of Scope

- Backend implementation (external service at `API_PROXY_TARGET`). Backend-origin problems are recorded as **Frontend Integration Issues** describing only frontend impact + frontend action.
- Backend API contract correctness beyond what the frontend consumes.
- Database, deployment infrastructure, CI systems (none found in repo).

## Method

1. Full inventory of `src/**` (26,148 lines across ~230 files).
2. Static analysis with targeted greps (patterns: `"use client"`, metadata exports, `localStorage`, `dangerouslySetInnerHTML`, `console.*`, `alert(`/`confirm(`, heavy-dependency imports, aria attributes, RHF/zod adoption).
3. Deep reads of core infrastructure: `api-utils.js`, `middleware.js`, `QueryProvider.jsx`, `useUserRole.js`, `useHeader.js`, `useFilters.js`, notification context/hook, layouts, navigation config, permissions lib.
4. Tool execution (read-only): `npm run lint` → **crash**; `npm test` → **failure**; git state inspection.
5. Dead-code claims verified by grepping all import sites across `src/`.

## Environment Facts Established

| Item | Value | Evidence |
|---|---|---|
| Framework | Next.js ^16.0.10 (App Router) | package.json |
| React | ^19.2.3 | package.json |
| Language | JavaScript (JSX), zero .ts/.tsx files | glob src |
| Type checking | none (`jsconfig.json` has no `checkJs`/`strict`) | jsconfig.json |
| Styling | Tailwind 3.4 + shadcn/radix primitives + CSS vars | tailwind.config.js, components.json |
| Server state | TanStack Query 5 (+devtools) | QueryProvider.jsx |
| Forms | react-hook-form declared, **0 usages**; zod present in 2 validation files only | grep |
| Charts | chart.js/react-chartjs-2 **and** recharts (both used) | stock/page.jsx, RevenueChartContent.jsx |
| Animation | framer-motion (19 files) | grep |
| i18n/RTL | Arabic, `<html lang="ar" dir="rtl">`, Cairo font | layout.jsx |
| Auth transport | httpOnly cookie `token`, verified in middleware via jose | middleware.js:22-28 |
| API access | same-origin `/api/*` proxied to external backend | next.config.mjs rewrites |
| Package manager | ambiguous — `package-lock.json` tracked, pnpm store on disk | node_modules/.pnpm |

## Constraints Honored

No source code was modified, no branches created, no packages installed during this audit.
