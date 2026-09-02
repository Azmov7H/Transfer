/**
 * T-FE-DOC-010 — ReceiptBody type-disambiguation + label-fix tests.
 *
 * Locks:
 *  - Customer receipts: title "سند تحصيل من عميل", amount label
 *    "المبلغ المُستلم", partner name "عميل نقدي" fallback, balance
 *    destructive style.
 *  - Supplier receipts: title "سند سداد لمورد", amount label
 *    "المبلغ المدفوع", partner name "مورد نقدي" fallback, balance
 *    emerald style.
 *  - instapay / wallet / bank render via the centralized map
 *    (no more description.includes('بنك') heuristic).
 *  - Source number is masked for non-privileged roles on
 *    electronic channels.
 */
import { render, screen } from '@testing-library/react';
import { ReceiptBody, detectReceiptType } from './page.jsx';

const SETTINGS = {
    companyName: 'مؤسستي',
    primaryColor: '#1B3C73',
    showLogo: false,
    phone: '010',
    email: 'a@b.co',
    address: 'القاهرة',
};

function makeTx(overrides = {}) {
    return {
        _id: 'a'.repeat(24),
        receiptNumber: 'REC-100',
        amount: 500,
        description: 'تحصيل دفعة',
        referenceType: 'UnifiedCollection',
        method: 'cash',
        sourceNumber: '',
        date: new Date('2026-08-30T14:30:00Z'),
        createdBy: { name: 'علي' },
        ...overrides,
    };
}

describe('detectReceiptType', () => {
    test('INCOME → customer', () => {
        expect(detectReceiptType({ type: 'INCOME' })).toBe('customer');
    });
    test('EXPENSE → supplier', () => {
        expect(detectReceiptType({ type: 'EXPENSE' })).toBe('supplier');
    });
    test('null/unknown → unknown', () => {
        expect(detectReceiptType(null)).toBe('unknown');
        expect(detectReceiptType({ type: 'OTHER' })).toBe('unknown');
    });
});

describe('ReceiptBody — type disambiguation (REQ-CCR-001 / REQ-SPR-001)', () => {
    test('customer receipt shows "سند تحصيل من عميل" + "المبلغ المُستلم"', () => {
        render(
            <ReceiptBody
                tx={makeTx()}
                partner={{ name: 'علي' }}
                settings={SETTINGS}
                remainingBalance={1000}
                receiptType="customer"
            />
        );
        expect(screen.getByTestId('receipt-title')).toHaveTextContent('سند تحصيل من عميل');
        const amountLabel = screen.getByTestId('receipt-amount-label').textContent;
        expect(amountLabel).toContain('المبلغ');
        expect(amountLabel).toContain('المُستلم');
    });

    test('supplier receipt shows "سند سداد لمورد" + "المبلغ المدفوع"', () => {
        render(
            <ReceiptBody
                tx={makeTx({ type: 'EXPENSE' })}
                partner={{ name: 'مورد عينة' }}
                settings={SETTINGS}
                remainingBalance={2500}
                receiptType="supplier"
            />
        );
        expect(screen.getByTestId('receipt-title')).toHaveTextContent('سند سداد لمورد');
        const amountLabel = screen.getByTestId('receipt-amount-label').textContent;
        expect(amountLabel).toContain('المبلغ');
        expect(amountLabel).toContain('المدفوع');
    });

    test('customer receipt falls back to "عميل نقدي" when no partner name', () => {
        render(
            <ReceiptBody
                tx={makeTx()}
                partner={null}
                settings={SETTINGS}
                receiptType="customer"
            />
        );
        expect(screen.getByTestId('receipt-partner-name')).toHaveTextContent('عميل نقدي');
    });

    test('supplier receipt falls back to "مورد نقدي" when no partner name', () => {
        render(
            <ReceiptBody
                tx={makeTx({ type: 'EXPENSE' })}
                partner={null}
                settings={SETTINGS}
                receiptType="supplier"
            />
        );
        expect(screen.getByTestId('receipt-partner-name')).toHaveTextContent('مورد نقدي');
    });

    test('data-receipt-type attribute distinguishes the two', () => {
        const { rerender } = render(
            <ReceiptBody
                tx={makeTx()}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                receiptType="customer"
            />
        );
        expect(screen.getByTestId('receipt-card').getAttribute('data-receipt-type')).toBe('customer');
        rerender(
            <ReceiptBody
                tx={makeTx({ type: 'EXPENSE' })}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                receiptType="supplier"
            />
        );
        expect(screen.getByTestId('receipt-card').getAttribute('data-receipt-type')).toBe('supplier');
    });
});

describe('ReceiptBody — payment method label (REQ-DOC-010)', () => {
    const cases = [
        ['cash',     'نقدي',       'الخزينة الخاصة'],
        ['bank',     'تحويل بنكي', 'البنك'],
        ['wallet',   'محفظة كاش',  'محفظة الكاش'],
        ['instapay', 'انستا باي',  'انستا باي'],
        ['check',    'شيك',        'الشيكات'],
    ];

    it.each(cases)('method=%s → label="%s" / channel="%s"',
        (method, methodLabel, channelLabel) => {
            render(
                <ReceiptBody
                    tx={makeTx({ method })}
                    partner={{ name: 'X' }}
                    settings={SETTINGS}
                    receiptType="customer"
                />
            );
            const methodNode = screen.getByTestId('receipt-method');
            expect(methodNode.textContent).toContain(methodLabel);
            expect(methodNode.textContent).toContain(channelLabel);
        });
});

describe('ReceiptBody — PII masking (REQ-DOC-008)', () => {
    test('electronic source number is masked for non-privileged roles', () => {
        render(
            <ReceiptBody
                tx={makeTx({ method: 'instapay', sourceNumber: 'IP-9876543210' })}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                receiptType="customer"
            />
        );
        // The mask format from lib/paymentMethods.maskSource is
        // '•••• 3210' (4 bullet characters + last 4 digits).
        expect(screen.getByTestId('receipt-source-number')).toHaveTextContent('•••• 3210');
        // Full source NEVER appears in the DOM.
        expect(screen.queryByText('IP-9876543210')).not.toBeInTheDocument();
    });

    test('non-electronic source number is not rendered at all', () => {
        render(
            <ReceiptBody
                tx={makeTx({ method: 'cash', sourceNumber: 'should-not-appear' })}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                receiptType="customer"
            />
        );
        expect(screen.queryByTestId('receipt-source-number')).not.toBeInTheDocument();
    });

    test('respects a pre-masked sourceNumber supplied by the backend', () => {
        render(
            <ReceiptBody
                tx={makeTx({ method: 'instapay', sourceNumber: 'IP-9876543210' })}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                sourceNumberDisplay="•••• 4321"
                receiptType="customer"
            />
        );
        // Backend-supplied mask wins; the client must NOT re-mask (which
        // would produce '•••• 3210' instead of '•••• 4321').
        expect(screen.getByTestId('receipt-source-number')).toHaveTextContent('•••• 4321');
    });
});

describe('ReceiptBody — reference label', () => {
    test('customer + Invoice → فاتورة مبيعات', () => {
        render(
            <ReceiptBody
                tx={makeTx({ referenceType: 'Invoice' })}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                receiptType="customer"
            />
        );
        expect(screen.getByTestId('receipt-reference-label')).toHaveTextContent('فاتورة مبيعات');
    });

    test('customer + Debt → مديونية سابقة', () => {
        render(
            <ReceiptBody
                tx={makeTx({ referenceType: 'Debt' })}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                receiptType="customer"
            />
        );
        expect(screen.getByTestId('receipt-reference-label')).toHaveTextContent('مديونية سابقة');
    });

    test('supplier + PurchaseOrder → أمر شراء', () => {
        render(
            <ReceiptBody
                tx={makeTx({ type: 'EXPENSE', referenceType: 'PurchaseOrder' })}
                partner={{ name: 'X' }}
                settings={SETTINGS}
                receiptType="supplier"
            />
        );
        expect(screen.getByTestId('receipt-reference-label')).toHaveTextContent('أمر شراء');
    });
});
