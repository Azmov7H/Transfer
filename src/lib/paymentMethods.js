// Centralized payment-method definitions (Sprint 1 foundation — FIN-UI-000).
// Single source of truth for payment channels across the frontend.
// Keep in sync with the backend enum (be-Jammaz/models/TreasuryTransaction.js):
//   cash | bank | wallet | check | adjustment | instapay

export const PAYMENT_METHODS = [
  { value: 'cash',       labelAr: 'نقدي',      labelEn: 'Cash',           channel: 'private_treasury', channelLabelAr: 'الخزينة الخاصة' },
  { value: 'bank',       labelAr: 'تحويل بنكي', labelEn: 'Bank Transfer',  channel: 'bank',            channelLabelAr: 'البنك' },
  { value: 'wallet',     labelAr: 'محفظة كاش',  labelEn: 'Cash Wallet',    channel: 'cash_wallet',      channelLabelAr: 'محفظة الكاش' },
  { value: 'instapay',   labelAr: 'انستا باي',  labelEn: 'InstaPay',       channel: 'instapay',         channelLabelAr: 'انستا باي' },
  { value: 'check',      labelAr: 'شيك',        labelEn: 'Check',          channel: 'check',            channelLabelAr: 'الشيكات' },
  { value: 'adjustment', labelAr: 'تسوية',      labelEn: 'Adjustment',     channel: 'adjustment',       channelLabelAr: 'تسويات' },
];

export const PAYMENT_METHOD_VALUES = PAYMENT_METHODS.map((m) => m.value);

export const PAYMENT_METHOD_LABELS_AR = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.value, m.labelAr])
);
export const PAYMENT_METHOD_LABELS_EN = Object.fromEntries(
  PAYMENT_METHODS.map((m) => [m.value, m.labelEn])
);

// Treasury channels (cashbox breakdown). Mirrors CashboxDaily fields in be-Jammaz.
export const TREASURY_CHANNELS = [
  { value: 'private_treasury', labelAr: 'الخزينة الخاصة', labelEn: 'Private Treasury' },
  { value: 'bank',             labelAr: 'البنك',          labelEn: 'Bank' },
  { value: 'cash_wallet',      labelAr: 'محفظة الكاش',    labelEn: 'Cash Wallet' },
  { value: 'instapay',         labelAr: 'انستا باي',      labelEn: 'InstaPay' },
  { value: 'check',            labelAr: 'الشيكات',        labelEn: 'Check' },
  { value: 'adjustment',       labelAr: 'تسويات',         labelEn: 'Adjustment' },
];

// Source-number (transfer reference) is required for electronic channels on NEW
// transactions — enforced by the backend Zod schema in Sprint 3 (FIN-VAL-002).
export const isSourceNumberRequired = (method) =>
  method === 'instapay' || method === 'wallet';

export const getPaymentLabel = (value, locale = 'ar') =>
  (locale === 'en' ? PAYMENT_METHOD_LABELS_EN : PAYMENT_METHOD_LABELS_AR)[value] ?? value;

// Mask a transfer source number for display (PII-friendly). Keeps head + last
// 2 digits (e.g. `123****78`); blank/short values collapse to '****'.
export const maskSource = (value) => {
  if (value == null || String(value).trim() === '') return '';
  const s = String(value).trim();
  if (s.length <= 4) return '****';
  return `${s.slice(0, 3)}****${s.slice(-2)}`;
};
