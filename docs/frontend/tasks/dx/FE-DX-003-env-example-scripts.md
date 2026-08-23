# FE-DX-003 — Environment Example & Script Hygiene

## Sprint
Sprint 00

## Branch
feat/frontend-sprint-00-baseline

## Priority
P3

## Severity
LOW (DX-002, DX-003)

## Objective
Document required env vars and remove the broken seed script reference.

## Problem
1. No `.env.example` despite required vars: `JWT_SECRET` (middleware.js:4), `API_PROXY_TARGET` (next.config.mjs rewrites), optional `NEXT_PUBLIC_API_URL` (api-utils.js:57).
2. `package.json:12` `"seed": "node scripts/seed.js"` → `scripts/` does not exist.

## Evidence
Repo root listing (no scripts dir, no .env*); middleware/config/env reads cited above.

## Root Cause
Leftovers from a repo split when backend moved out.

## Scope
### In Scope
- Add `.env.example` with keys + comments, empty values.
- Remove `seed` script or restore a frontend-appropriate version (default: remove).
### Out of Scope
Any real secret values; CI secrets setup.

## Affected Files
- `.env.example` (new), `package.json`

## Implementation Steps
1. Write `.env.example`: JWT_SECRET=, API_PROXY_TARGET=http://127.0.0.1:5050, NEXT_PUBLIC_API_URL= with one-line comments each.
2. Delete `seed` script entry.
3. Confirm `.gitignore` covers `.env*` (already does at line 34).

## Dependencies
None.

## Risks
None.

## Testing Requirements
Fresh clone: copy example → dev server starts and middleware no longer warns about missing JWT_SECRET (with dummy value).

## Acceptance Criteria
- [ ] `.env.example` present and accurate
- [ ] No script references nonexistent files

## Definition of Done
Standard DoD.

## Related Findings
DX-002, DX-003 · **Related Tasks:** FE-CLEAN-001
