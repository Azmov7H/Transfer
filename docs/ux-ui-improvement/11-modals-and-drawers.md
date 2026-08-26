# 11 — Modals & Drawers Audit

## Problem
1. **Payment dialog fragmentation** (F1/P0): 5 variants — `PaymentDialog`, `UnifiedPaymentDialog`, `InvoicePaymentDialog`, `InstallmentDialog`, `AddTransactionDialog`. Same mental act, different layouts per entry point.
2. Customers page chains dialogs (details → payment → installment) — nested modal stacks lose context and scroll position.
3. Large forms trapped in modals: supplier debt manager, installment schedule creation.
4. Duplicate detail surfaces: customer details dialog AND detail page.
5. Unused variants (`NotificationPopover`, `NotificationSidebar`) add maintenance noise.

## Decision Matrix (target state)

| Interaction | Current | Decision | Rationale |
|---|---|---|---|
| Record payment (any target) | 5 dialogs | **One unified Modal** | identical transactional act; context passed as prop (IA-3) |
| Installment plan create/view | Dialog | **Drawer** | schedule table needs width; user reviews while editing |
| Customer details | Dialog + Page | **Page only** (`/customers/[id]` w/ tabs) | linkable, back-button friendly |
| Customer/Product/Supplier create+edit | Dialogs | **Modal (small forms)** / Drawer for multi-section edit | short CRUD stays in-context |
| Invoice shortage report | small Dialog | keep modal | micro-task |
| Invoice return | Dialog | keep modal, restyle | bounded task |
| Transaction add | Dialog | keep modal | single-row entry |
| Notifications | Sidebar drawer | keep drawer; delete unused Popover/Sidebar variants | consolidation |
| Destructive confirmations | ConfirmDialog | keep everywhere | already standardized |
| Global search results | none real | Command palette popover | see UX-014 |

### Anti-nesting rule
A dialog may not open another dialog. Flows that chain today redirect to the drawer/page equivalent (e.g., payment from details → same unified dialog invoked at page level, closing the first). Focus returns to trigger via Radix defaults.

### Sizing & behavior standards
- Modal max-w: sm=28rem (confirms), md=36rem (forms), lg=44rem (payments w/ history preview).
- Drawers: right-side (RTL start edge consistent with sidebar), width min(480px, 90vw).
- All overlays: title + optional description, close button aria-labeled, Escape/backdrop dismiss per Radix defaults, body-scroll lock (existing).

## Business Logic Preservation
All mutations and payloads unchanged; only container components change. Unified payment must expose exact field-parity union (verified per-variant checklist before old variants are deleted).

## Components Affected
All files under `components/financial/` (12), customers page/dialogs, notifications (7→4 files), `ui/sheet.jsx` styling pass.

## Dependencies
IA-2/IA-3 decisions; FormKit (09); tables doc for drawer-embedded schedule view.

## Risks
Highest-risk workstream alongside IA-3 (payment parity). Mitigation: variant-by-variant parity matrix (fields, validation, endpoint, success behavior) reviewed before any deletion; manual test script per entry point × role.

## Acceptance Criteria
1. One payment dialog code path; all existing entry points behave identically to their previous variant (field-for-field).
2. No nested-dialog chains remain on customers/debt flows.
3. Zero-importer overlay components deleted.
4. Focus trap + focus return verified keyboard-only.

## Priority: P0 (payment unification) · Complexity: L

---

## Tasks
| ID | Task | Pri |
|---|---|---|
| UX-080 | Payment parity matrix doc → then build UnifiedPaymentDialog v2 | P0 |
| UX-081 | Re-point all entry points; delete legacy variants after parity sign-off | P0 |
| UX-082 | Installment flow → Drawer | P1 |
| UX-083 | Remove customer-details dialog; consolidate on detail page tabs (with IA-2) | P1 |
| UX-084 | Delete unused notification overlay variants | P3 |
| UX-085 | Overlay sizing/behavior standard applied to remaining modals | P2 |
