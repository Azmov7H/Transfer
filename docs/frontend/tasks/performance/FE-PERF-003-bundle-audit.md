# FE-PERF-003 — Bundle Audit & RSC Evaluation

## Sprint
Sprint 08

## Branch
feat/frontend-sprint-08-performance

## Priority
P2

## Severity
MEDIUM (NEXT-001 evaluation)

## Objective
Measured bundle baseline and an evidence-based decision on first RSC conversion.

## Problem
Client-everything rendering (NEXT-001) is the largest structural cost but was never measured; framer-motion in 19 files never audited.

## Evidence
03-next-react-audit.md NEXT-001; 11-performance-audit.md PERF-003.

## Root Cause
No measurement culture.

## Scope
### In Scope
1. Add `@next/bundle-analyzer` (devDependency) + document how to run.
2. Produce baseline + post-sprint-08 comparison.
3. Audit framer-motion sites: convert pure enter/fade animations to CSS where trivial.
4. Evaluate ONE candidate page for RSC initial-fetch conversion (recommend customers list); implement only if measured win (TTFB/LCP on throttled profile).
### Out of Scope
Wholesale RSC migration; micro-optimizations without numbers.

## Affected Files
- next.config.mjs, new analysis docs
- candidate page files if conversion proceeds

## Implementation Steps
As scoped above; record all numbers in `docs/frontend/architecture/` appendix or PR.

## Dependencies
FE-PERF-001/002 merged (clean comparison point).

## Risks
RSC conversion touching auth/session assumptions — keep client fallback ready.

## Testing Requirements
Lighthouse/throttled-network before-after for candidate.

## Acceptance Criteria
- [ ] Baseline recorded
- [ ] Decision documented with data

## Definition of Done
Standard DoD + metrics.

## Related Findings
NEXT-001 · **Related Tasks:** FE-PERF-001, FE-PERF-002
