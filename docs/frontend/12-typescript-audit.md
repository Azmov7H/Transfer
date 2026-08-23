# 12 — TypeScript Audit

## Finding

### TYPE-001 — Zero Static Typing on a 26k-Line Business App (MEDIUM)
- Pure JavaScript: zero `.ts`/`.tsx` files.
- `jsconfig.json` contains only path aliases — no `checkJs`, no `strict`.
- JSDoc annotations exist sporadically (`permissions.js:49-102`, `api-response.js:9-42`) but are unchecked documentation. One explicit `{any}` (`useDebounce.js:5`).
- API response shapes are entirely implicit: `response.data.customer.invoices[0].total` chains trust backend shape with no contract anywhere.

## Assessment

A full TS migration is **out of scope** for this remediation program (high churn, low immediate user value relative to other gaps). Pragmatic ladder, in order:

1. **Now (free):** enable `checkJs: true` + `// @ts-check` incrementally? — *Rejected for now:* without type definitions it produces noise. Instead:
2. **Sprint 02:** centralize endpoint contracts as documented JSDoc `@typedef` shapes in a new `src/services/contracts.js` while consolidating endpoints (FE-DATA-005). Cheap, immediately useful to editors/agents.
3. **Sprint 09+:** zod schemas (already installed) double as runtime validators + inferred types for the highest-risk flows (invoice totals, payments).
4. **Future (explicitly deferred):** incremental `.ts` migration starting with `lib/`, `services/`, `hooks/`.

No unsafe-cast/non-null-assertion findings apply (JS codebase).
