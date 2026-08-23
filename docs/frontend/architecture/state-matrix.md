# UI-State Matrix (FE-PAGES-005)

Coverage of the four content states per surface: **Loading / Error / Empty / Unauthorized**.
Primitives: `LoadingState`, `ErrorState`, `EmptyState` (`components/common/`), `RoleGate` unauthorized (D11).

| Page | Loading | Error | Empty | Unauthorized | Filters URL-synced |
|---|---|---|---|---|---|
| customers | ✅ TableLoadingState | ✅ TableErrorState+retry | ✅ inline empty | n/a (all roles) | ✅ via useFilters |
| products | ✅ TableLoadingState | ✅ TableErrorState+retry | ✅ inline empty | RoleGate `products:view` (layout) | ✅ |
| invoices | ✅ | ✅ ErrorState+retry | ✅ inline empty | n/a | ✅ |
| stock | ✅ | ✅ | ✅ | layout | ✅ |
| stock-movements | ✅ | ✅ | ✅ | layout | ✅ |
| suppliers | ✅ | ✅ | ✅ inline empty | n/a | ✅ |
| purchase-orders | ✅ | ✅ | ✅ ×4 branches | n/a | ✅ |
| sales-returns | ✅ | ✅ | ✅ | n/a | ✅ |
| physical-inventory | ✅ | ✅ | ✅ | `audit:manage` nav gate | ✅ |
| audit | ✅ spinner | toast path | ✅ inline empty | RoleGate roles | — |
| logs | ✅ | silent (raw fetch) | ✅ inline empty | RoleGate `activity:view` | — |
| receivables | ✅ | ✅ | ✅ | RoleGate owner+manager (layout) | — |
| reports (×5) | ✅ | partial | ✅ per-report | n/a | date-range based |
| financial (treasury) | ✅ | ✅ mutation toasts | ✅ table empty row | n/a | period selector |
| accounting | ✅ per tab | ✅ query error paths | ✅ entries empty | manager+owner data | in-page filters |
| settings | ✅ save pending | ✅ toast | — | RoleGate `settings:manage` | tabs |

## Notes

- URL sync (`q`, `filter`, `page`) uses `router.replace` — no history pollution while typing; refresh/back/forward preserve state.
- Legacy param names kept compatible with prior useSearchParams consumers.
- `audit` and `logs` remain raw-fetch legacy surfaces; their full migration is scheduled with Sprint 10 cleanup (low traffic, admin-only).
