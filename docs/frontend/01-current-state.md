# 01 — Current State

## Application Map

```
src/
├── app/
│   ├── layout.jsx            # Root: Cairo font, ThemeProvider, QueryProvider,
│   │                         #   NotificationProvider, LazyNotificationCenter, sonner Toaster
│   ├── loading.jsx           # Root loading
│   ├── (public)/login/       # Login page (client)
│   └── (protected)/          # Authenticated shell (Sidebar + Header layout)
│       ├── layout.jsx        # SidebarProvider + Sidebar + Header + main container
│       ├── loading.jsx / error.jsx
│       ├── page.jsx          # Dashboard (243 lines, client)
│       ├── (admin)/          # users, audit, logs, settings — UI-level role checks only
│       ├── (operations)/     # products, stock, stock-movements
│       ├── (finance)/        # receivables
│       ├── customers/[id]/   # server page.jsx → CustomerClient.jsx (client)
│       ├── financial/        # financial (864), debt-center, expenses, receipts/[id]
│       ├── accounting/ daily-sales/ analytics/stock/
│       ├── invoices/ (+new, [id])  purchase-orders/  sales-returns/  suppliers/
│       ├── physical-inventory/ (+new, [id])
│       └── reports/          # sales, financial, price-history, profit-by-customer, shortage
├── components/               # ~90 components: ui/ (shadcn), feature dirs, Header/Sidebar/ErrorBoundary
├── hooks/                    # 24 hooks (data, filters, debounce x2, mobile, sidebar, header…)
├── services/                 # 25 service modules (thin fetch wrappers over api.*)
├── lib/                      # api-utils, auth (dead), cache/cache-config/api-response (dead),
│                             #   permissions, validators.test.js (broken)
├── config/navigation.js      # Sidebar nav with permission strings
├── constants/                # labels
├── context/NotificationContext.jsx
├── providers/                # QueryProvider, SidebarProvider
├── utils/index.js            # cn, formatCurrency(ar-EG EGP), formatDate(ar-EG)
└── validations/              # zod schemas (product, expense/invoice) — barely consumed
```

## Rendering Model

- **106 files** carry `"use client"`. Exactly **one page** (`customers/[id]/page.jsx`) is a server component, and it only renders `<CustomerClient/>`.
- **Zero server-side data fetching.** No async server components, no `fetch` in RSC, no server actions.
- Next.js operates as a SPA-with-SSR-shell; the entire data layer runs client-side through TanStack Query.

## Data Flow

```
Component → hook (useQuery/useMutation) → services layer or direct api.*
        → src/lib/api-utils.js fetcher() → same-origin /api/* 
        → middleware.js JWT check (cookie 'token') → rewrite → external backend :5050
Session: useUserRole → GET /api/auth/session (queryKey ['user-session'], staleTime 5min, refetchOnFocus true)
Notifications: root-level poll every 30s regardless of auth state
```

## What Works Well

- Coherent route-group structure `(protected)/(admin|operations|finance)` with a shared shell layout.
- Consistent Arabic RTL localization incl. `ar-EG` currency/date formatting and date-fns `ar` locale.
- TanStack Query adopted broadly for lists/mutations with invalidation; sensible global defaults (staleTime 60s, retry w/ backoff).
- shadcn/ui primitives give a solid accessible base (Radix) where used.
- No secrets in client code, no web-storage token persistence (httpOnly cookie transport).
- next.config has thoughtful settings: `poweredByHeader:false`, `removeConsole` in prod, `optimizePackageImports`.

## Systemic Weaknesses (detail in audits)

1. Validation pipeline broken end-to-end (lint crash, test crash, package-manager ambiguity).
2. Client-everything rendering model; Next.js server capabilities unused.
3. God pages (864/694/680/634/622 lines) mixing fetching, forms, dialogs, tables.
4. Error handling gaps: no global boundaries, silent 401/403, native `alert`/`confirm` mixed with sonner toasts.
5. Dead code layer: backend helpers (`lib/auth.js`, `lib/cache*.js`, `api-response.js`), dead components (`ThemeToggle`, `themes/Toggle`, unmounted `ErrorBoundary`), dead service (`exportService.js`).
6. Forms are hand-rolled per dialog despite RHF+zod being installed.
7. Effectively zero test coverage; the single test file doesn't even run.

## Toolchain Reality Check

| Command | Result |
|---|---|
| `npm run dev` | assumed OK (not part of audit execution) |
| `npm run lint` | ❌ TypeError: circular structure (FlatCompat × eslint-config-next under pnpm layout) |
| `npm test` | ❌ Cannot find module (validators.test.js imports extensionless path) |
| `npm run build` | not executed during audit (VERIFY in Sprint 00) |
| typecheck | n/a — no TypeScript |
