/**
 * T-FE-DOC-011 — InvoicePrintView payment-label regression lock.
 *
 * The legacy view used a hard-coded ternary that rendered
 * `instapay / wallet / check` as 'آجل' (credit). The redesigned
 * component looks up the method via getPaymentMethod() and renders
 * the correct label + (when electronic) the masked source number.
 * Channel and creator rows are intentionally NOT customer-facing
 * (removed from the printed invoice) and must stay absent.
 */
import { render, screen } from '@testing-library/react';
import { InvoicePrintView } from './InvoicePrintView';

const SETTINGS = {
    companyName: 'X', primaryColor: '#000', headerBgColor: '#000',
    address: '', phone: '', additionalPhones: [], email: '', website: '',
    footerText: '', showLogo: false, showQRCode: false,
};

const INVOICE = {
    number: 'INV-1',
    date: '2026-08-30',
    customerName: 'علي', customerPhone: '010',
    items: [],
    subtotal: 0, tax: 0, total: 0,
    paymentType: 'cash',
    createdBy: { name: 'Owner' },
};

describe('InvoicePrintView — payment method label (REQ-SINV-005)', () => {
    const cases = [
        ['cash',     'نقدي',       'الخزينة الخاصة',  false],
        ['bank',     'تحويل بنكي', 'البنك',           false],
        ['wallet',   'محفظة كاش',  'محفظة الكاش',     true],
        ['instapay', 'انستا باي',  'انستا باي',       true],
        ['check',    'شيك',        'الشيكات',         false],
        ['credit',   'آجل',        '',                false], // 'آجل' for the legacy enum value
    ];

    it.each(cases)('paymentType=%s → method="%s" channel="%s" source=%s',
        (paymentType, methodLabel, channelLabel, showsSource) => {
            const inv = {
                ...INVOICE,
                paymentType,
                sourceNumber: showsSource ? 'IP-1234567890' : undefined,
            };
            render(<InvoicePrintView invoice={inv} settings={SETTINGS} />);
            // The method label is rendered in the info grid.
            // Channel and method may share a label (e.g. instapay) — use
            // getAllByText + at-least-one so the assertion is stable.
            expect(screen.getAllByText(methodLabel).length).toBeGreaterThan(0);
            // Channel row removed from the customer-facing invoice.
            expect(screen.queryByText('القناة:')).not.toBeInTheDocument();
            if (channelLabel && channelLabel !== methodLabel) {
                expect(screen.queryByText(channelLabel)).not.toBeInTheDocument();
            }
            // Creator row removed from the customer-facing invoice.
            expect(screen.queryByText('بواسطة:')).not.toBeInTheDocument();
            if (showsSource) {
                // Source is masked: '•••• 7890' (last 4 of 'IP-1234567890')
                expect(screen.getByText('•••• 7890')).toBeInTheDocument();
                // Full value NEVER leaks.
                expect(screen.queryByText('IP-1234567890')).not.toBeInTheDocument();
            } else {
                expect(screen.queryByText('رقم التحويل:')).not.toBeInTheDocument();
            }
        });
});

describe('InvoicePrintView — status badge follows payment state', () => {
    const statusCases = [
        // [paymentStatus, paidAmount, total, expectedLabel]
        ['pending', 0, 1000, 'غير مدفوع'],   // credit sale: unpaid
        ['partial', 400, 1000, 'مدفوع جزئياً'],
        ['paid', 1000, 1000, 'مدفوع بالكامل'],
    ];

    it.each(statusCases)('status=%s paid=%s total=%s → "%s"',
        (paymentStatus, paidAmount, total, expectedLabel) => {
            const inv = { ...INVOICE, paymentStatus, paidAmount, total };
            render(<InvoicePrintView invoice={inv} settings={SETTINGS} />);
            expect(screen.getByText(expectedLabel)).toBeInTheDocument();
        });

    it('derives unpaid from amounts when paymentStatus is missing (credit sale)', () => {
        const inv = { ...INVOICE, paymentType: 'credit', paidAmount: 0, total: 1000 };
        delete inv.paymentStatus;
        render(<InvoicePrintView invoice={inv} settings={SETTINGS} />);
        expect(screen.getByText('غير مدفوع')).toBeInTheDocument();
        expect(screen.queryByText('مدفوع بالكامل')).not.toBeInTheDocument();
    });
});

describe('InvoicePrintView — backwards compat', () => {
    it('renders without crashing when paymentType is missing', () => {
        const inv = { ...INVOICE };
        delete inv.paymentType;
        const { container } = render(<InvoicePrintView invoice={inv} settings={SETTINGS} />);
        // Falls back to a generic label, no crash.
        expect(container.firstChild).not.toBeNull();
    });
});
