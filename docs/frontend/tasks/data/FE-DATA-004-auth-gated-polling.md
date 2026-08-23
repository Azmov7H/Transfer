# FE-DATA-004 — Auth-Gated Notification Polling

## Sprint
Sprint 02

## Branch
feat/frontend-sprint-02-data-state

## Priority
P1

## Severity
MEDIUM (DATA-004)

## Objective
Notification polling runs only for authenticated sessions.

## Problem
`NotificationProvider` mounts in root layout; `useNotifications` polls `GET /api/notifications` every 30s unconditionally — on /login and post-logout this produces perpetual 401 churn (amplified by global retry:3).

## Evidence
`layout.jsx` provider stack; `useNotifications.js:12-17`.

## Root Cause
Provider placed globally without auth awareness.

## Scope
### In Scope
- Enable the query only when a session exists (consume `useUserRole`'s `['user-session']` cache — no extra requests).
- Stop polling on logout; resume on login.
### Out of Scope
Moving NotificationProvider into protected layout (would break login-page notification UX expectations; evaluate only if trivially safe — prefer enabled-gating).

## Affected Files
- `src/hooks/useNotifications.js` (or NotificationContext wiring)

## Implementation Steps
1. Add `enabled: !!sessionUser` to the notifications useQuery.
2. Verify no circular hook dependency (useUserRole is independent).

## Dependencies
FE-STATE-001 (clean session shape to key off).

## Risks
Low.

## Testing Requirements
Manual: logged out → zero `/api/notifications` calls; login → polling begins within one interval.

## Acceptance Criteria
- [ ] Zero notification requests when unauthenticated

## Definition of Done
Standard DoD.

## Related Findings
DATA-004 · **Related Tasks:** FE-STATE-001, FE-TEST-002
