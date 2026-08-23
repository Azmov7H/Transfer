# MEDIUM Findings

| ID | Title | Evidence (file:line) | Task |
|---|---|---|---|
| COMP-001 | Triplicated product selector | `invoices/ProductSelectorModal.jsx` / `products/ProductSelectorDialog.jsx` / `products/QuickAddProductDialog.jsx`, one consumer each | FE-COMP-001 |
| UX-001 | Native alert()/confirm() ×10 | financial/page.jsx:86,104,118; users/page.jsx:52; suppliers/page.jsx:68; purchase-orders/page.jsx:115; products/page.jsx:85; customers/page.jsx:152; invoices/[id]/page.jsx:134; InvoiceListItem.jsx:153 | FE-UX-001 |
| COMP-002 | State primitives under-applied | common/LoadingState, ErrorState, ui/skeleton exist; bespoke spinners/blank bodies elsewhere | FE-COMP-002, FE-PAGES-005 |
| DATA-002 | No timeout/cancellation | zero AbortController/signal in src/ | FE-DATA-002 |
| DATA-003 | No unified mutation toast/error policy | toasts in hooks (useCustomers) vs components vs console-only (invoices/[id] ×5) | FE-DATA-003 |
| DATA-004 | Unauth notification polling | NotificationProvider in root layout; useNotifications refetchInterval 30000 | FE-DATA-004 |
| DATA-005 | Endpoint duplication hooks↔services | useCustomers inline URLs vs services/customerService.js; ARCH-002 bypass list | FE-DATA-005 |
| STATE-001 | useUserRole accidental shape handling | useUserRole.js:22-27 + comment contradicting api-utils.js:126-128 unwrap | FE-STATE-001 |
| PERF-002 | Dual chart libraries | stock/page.jsx:44-45 & SalesChart.jsx (chart.js) vs RevenueChartContent.jsx:11 (recharts) | FE-PERF-002 |
| TYPE-001 | Zero static typing | jsconfig minimal; 0 .ts files; implicit API shapes everywhere | FE-DATA-005 contracts; migration deferred |
| SEO-001 | Metadata gaps | only layout.jsx:16 metadata; no template/per-page; English default 404 | FE-NEXT-001 |
| A11Y-001 | Unlabeled icon buttons | aria-label present in only 5 files across src | FE-A11Y-001 |
| SEC-002 | innerHTML print hack | PartnerTransactionDialog.jsx:39-43 (body swap + location.reload) | FE-SEC-002 |
