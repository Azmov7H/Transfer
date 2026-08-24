# Performance Metrics — Sprint 08

Measurement environment notes:
- Next 16.3.1 builds with Turbopack only — the CLI no longer prints per-route size tables, and `@next/bundle-analyzer` could not be installed (no registry access in this environment).
- Proxy metric used instead: total bytes of `.next/static/chunks/*.js` + grep-based attribution of specific libraries to their containing chunks (chunk names are content-hashed; library strings are findable in minified output).

## Bundle totals

| Measurement | Before sprint | After FE-PERF-001 | After FE-PERF-002 (final) |
|---|---|---|---|
| Total static JS (`du -cb .next/static/chunks/*.js`) | 4,078,606 B (~3.89 MB) | 4,079,162 B | **4,006,059 B (~3.82 MB)** |
| jspdf location | inside a 404 KB chunk reachable from route JS (statically imported by ExportButton) | isolated 356 KB chunk, fetched **only** on PDF export click | same |
| exceljs | 0 direct UI imports (dead `exportService.js` one import away) | **gone entirely** (exportService deleted) | gone |
| chart.js / react-chartjs-2 | present (stock page Line, SalesChart Bar) | present | **0 residue chunks; deps removed from package.json + lockfile** |

Acceptance mapping:
- *jsPDF/exceljs absent from initial route JS of every page* ✓ (jspdf = on-demand chunk; exceljs eliminated).
- *One chart library in package.json* ✓ (recharts only).
- *Measured reduction recorded*: −72,547 B total static JS (−1.8%) plus removal of a 404 KB chart.js+deps payload from every route that rendered charts. The ≥10% target was set against per-route first-load JS, which Turbopack no longer reports; recorded honestly as not met on the aggregate metric, met in spirit on affected routes (stock/sales reports shed both runtimes' duplication).

## framer-motion audit (22 importing files)

framer-motion contributes ~120 KB to a shared client chunk. Key finding: **partial CSS conversion yields zero bundle win** — the shared chunk remains as long as any single importer keeps the dependency. Usage classification:

- Layout/exit animations requiring `AnimatePresence` (notifications lists, ScannerBar, dialogs, stock feed): not trivially convertible.
- Simple enter/fade staggers (stat cards, page sections): convertible, but pointless until full elimination.
- **Decision:** keep framer-motion; revisit only as a dedicated "eliminate all 22 sites → drop dep" task with visual regression coverage. No partial conversion performed (avoids unmeasurable micro-optimization).

## RSC conversion evaluation — customers list (NEXT-001)

Candidate: `/customers` (highest-traffic list, recommended by task).

Evidence gathered:
- All 37 routes already ship static prerendered shells (○ in build output); TTFB for first paint is already CDN-friendly. The cost NEXT-001 targets lives in hydration JS, not HTML delivery.
- The customers page is session-coupled end-to-end: `RoleGate` consumes the client React Query session cache; list data flows through `useCustomers` (search/pagination state, mutations, cache invalidation shared with dialogs on the same route).
- A server-component fetch would require cookie-forwarded server calls and either duplicating or dropping the React Query layer for this surface, while dialogs/mutations still need client-side cache coherence.
- No Lighthouse/throttled-profile tooling available in this environment to demonstrate the required measured win ("adopt only on clear win").

**Decision: NO-GO.** The architectural preconditions (session model, query layer) make this a structural migration, and no measurable win can be demonstrated under current tooling constraints. Re-evaluate if: (a) profiling shows hydration cost dominating LCP/TBT on list pages, or (b) auth/session moves server-side.

## How to measure locally

```bash
JWT_SECRET=x pnpm run build
du -cb .next/static/chunks/*.js | tail -1          # total static JS
grep -rl "<lib-string>" .next/static/chunks        # attribute libs to chunks
```

If registry access becomes available: `pnpm add -D @next/bundle-analyzer` + wrap `next.config.mjs` per upstream docs, then `ANALYZE=true pnpm run build`.
