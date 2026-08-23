# FE-DATA-005 — Endpoint Contract Consolidation

## Sprint
Sprint 02

## Branch
feat/frontend-sprint-02-data-state

## Priority
P1

## Severity
MEDIUM (DATA-005, ARCH-002, TYPE-001 mitigation)

## Objective
Every endpoint URL and response shape lives exactly once — in the services layer with JSDoc typedefs.

## Problem
URLs hardcoded inline in hooks (`useCustomers.js` → `/api/customers`) while parallel service modules exist (`services/customerService.js`); some pages import `api` directly (financial/page.jsx:15, useHeader.js:5, NotificationContext.jsx:9). Response shapes are entirely implicit.

## Evidence
02-architecture-audit.md ARCH-002; 06-data-layer-audit.md DATA-003/005.

## Root Cause
Services layer created but never made the enforced path of least resistance.

## Scope
### In Scope
- For each domain: service module owns URL builder + typed (JSDoc @typedef) request/response contract; hook consumes service.
- Migrate direct `api` usage in pages/context/hooks to services.
- No behavior change: same URLs, same params.
### Out of Scope
Runtime validation schemas for every endpoint (only high-risk flows get zod later); renaming endpoints.

## Affected Files
- `src/services/**` (25 modules, many to be filled in)
- all `src/hooks/**` consumers
- `financial/page.jsx`, `useHeader.js`, `NotificationContext.jsx`, others per grep of direct api imports

## Implementation Steps
1. Pick customers as template: fill customerService with functions + typedefs; switch useCustomers.
2. Repeat per domain (products, invoices, financial, stock, suppliers, users, notifications, auth, reports).
3. Grep-enforce: no `from '@/lib/api-utils'` outside services + lib after migration.

## Dependencies
FE-DATA-001..003 landed (stable fetcher + feedback policy).

## Risks
Large mechanical diff → split into per-domain commits within one PR.

## Testing Requirements
Full manual regression walk of CRUD flows per domain migrated; build green.

## Acceptance Criteria
- [ ] Single source of truth per endpoint
- [ ] Direct api imports eliminated from UI layer
- [ ] Core entities have response typedefs

## Definition of Done
Standard DoD.

## Related Findings
DATA-005, ARCH-002, TYPE-001 · **Related Tasks:** FE-DATA-003, FE-PAGES-001..004 (they consume these services)
