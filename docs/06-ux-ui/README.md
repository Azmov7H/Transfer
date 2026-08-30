# 06 — UX/UI Plan

Focus: payment-method selection, conditional source field, party role selection, treasury display, export UX,
validation feedback, RTL, mobile, accessibility, consistency. **Do not redesign unrelated functionality.**

## 06.1 — Payment-Method Selection

- **UX-001** — Replace all ad-hoc method toggles with a single shared component
  `components/common/PaymentMethodSelect.jsx` driven by `src/constants/paymentMethods.js` (from FIN-UI-000).
  Uniform labels, icons, order across: sale, collection, supplier payment, manual tx, expense, debt payment.
- **UX-002** — Visual channel affordance: each method shows a distinct icon/color (cash=wallet, bank=landmark,
  wallet=smartphone, instapay=mobile-receipt, check=document). Keep consistent with existing `lucide` usage.

## 06.2 — Conditional Source-Number Field

- **UX-003** — `SourceNumberField` (FIN-UI-007) appears **inline, directly under** the method select, only when
  `instapay` or `wallet` is chosen. Autofocus on show. Placeholder "رقم حساب المحول / رقم التحويل".
- **UX-004** — Required-state styling: red border + asterisk; error message "رقم حساب التحويل مطلوب لطريقة الدفع هذه"
  appears on blur/submit. Mirrors backend message.
- **UX-005** — Mask display in tables/history: show last 4 digits with a tooltip/expand for full (PII, see
  `07-security`). e.g., `•••• 4821`.

## 06.3 — Customer/Supplier Role Selection

- **UX-006** — On Customer detail: a clear "الدور: عميل" badge with an action "إضافة دور المورد" opening a dialog
  (create-or-link). Symmetric on Supplier. Use existing `Dialog`/`Sheet` primitives.
- **UX-007** — "Net position" card: shows customer balance (receivable) and supplier balance (payable) and the net,
  with sign legend ("صافي مستحق عليهم" vs "صافي لنا"). Color-coded (success/destructive) like existing `StatCard`.
- **UX-008** — Duplicate-candidates screen: table of potential Customer↔Supplier matches with confidence + "ربط"
  button (confirm dialog). Read-only until confirmed.

## 06.4 — Treasury / Channel Display

- **UX-009** — `TreasuryStatsCards` adds an InstaPay tile (reuse `StatCard` style). Show channel breakdown in the
  financial summary with method filter chips (already present; add instapay chip).
- **UX-010** — Transaction history rows: method badge includes instapay; source number shown subtly (masked).

## 06.5 — Export Interaction

- **UX-011** — `ExportButton` becomes a single dropdown: "تصدير CSV" / "تصدير Excel" / "تصدير PDF". Disabled with
  tooltip "جارٍ التصدير…" while loading; success/error toasts (existing `sonner`). Reflect applied filters in the
  label (e.g., "تصدير (مع الفلاتر)").
- **UX-012** — Loading & error states: spinner; on failure, toast with retry; on empty result, friendly notice,
  no crash.
- **UX-013** — Large exports: show progress / async hint ("قد يستغرق بعض الوقت") and avoid blocking UI.

## 06.6 — RTL / Mobile / Accessibility

- **UX-014** — All new inputs follow RTL (existing `globals.css` RTL). Labels right-aligned; numeric inputs
  LTR-within-RTL where appropriate.
- **UX-015** — Mobile: forms stack; dialogs full-width on small screens (reuse shadcn `Dialog` responsive classes).
- **UX-016** — Accessibility: labels associated with inputs; required fields announced; error text linked via
  `aria-describedby`; focus trap in dialogs (shadcn provides); keyboard operable method select.

## 06.7 — Consistency

- Reuse existing primitives (`Button`, `Input`, `Select`, `Dialog`, `Card`, `Badge`, `StatCard`, `ConfirmDialog`).
- Arabic copy reviewed for consistency with existing terminology (e.g., "محفظة" for wallet, "انستاباي" for InstaPay).
- No new color tokens; use existing `success`/`destructive`/`warning`/`primary` semantics.

## Acceptance (summary)

Covered by `13-acceptance-criteria.md` UX/Export sections. Verified in `08-testing` (component + E2E).
