# FE-COMP-001 — Consolidate Product Selector

## Sprint
Sprint 04

## Branch
feat/frontend-sprint-04-ui-system

## Priority
P1

## Severity
MEDIUM (COMP-001)

## Objective
One parameterized product-picker component serving invoice items, stock movements, and purchase orders.

## Problem
Three near-identical implementations, each with exactly one consumer, diverging in search UX/loading/keyboard behavior:
- `invoices/ProductSelectorModal.jsx` ← InvoiceItemsManager
- `products/ProductSelectorDialog.jsx` ← StockMovementDialog
- `products/QuickAddProductDialog.jsx` ← purchase-orders page

## Evidence
04-component-audit.md COMP-001 table (import sites).

## Root Cause
Feature teams copied rather than shared.

## Scope
### In Scope
- Unified `ProductSelector` in `src/components/products/`: props for selection mode (single/multi), stock display toggle, quick-add hook.
- Migrate the three consumers; delete the three old files.
### Out of Scope
Behavior redesign — preserve each flow's semantics; visual polish only where free.

## Affected Files
- new unified component
- `InvoiceItemsManager.jsx`, `StockMovementDialog.jsx`, `(operations)/(products)`… actually `purchase-orders/page.jsx`
- delete: the three legacy selectors

## Implementation Steps
1. Diff the three to enumerate behavioral deltas; document which behavior wins per prop.
2. Build unified component using SmartCombobox + FE-COMP-002 states.
3. Migrate consumers one commit each; delete legacy files.

## Dependencies
FE-COMP-002 (states), FE-DATA-005 (product service contract).

## Risks
Invoice flow is revenue-critical → migrate last and regression-test item add/remove/totals.

## Testing Requirements
Manual matrix: all three flows; keyboard search + Enter selection.

## Acceptance Criteria
- [ ] Exactly one selector implementation remains
- [ ] All three flows behave as before per documented delta table

## Definition of Done
Standard DoD.

## Related Findings
COMP-001 · **Related Tasks:** FE-COMP-002, FE-PAGES-004
