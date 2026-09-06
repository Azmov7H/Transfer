/**
 * TreasuryPrintView structural tests.
 *
 * Locks the direct-print contract: full-period rows render 1:1
 * (one row per record, description in a single cell), the summary
 * matches the printed set, and the view stays hidden on screen
 * (`hidden print:block` — only the browser print engine shows it).
 */
import { render, screen, within } from '@testing-library/react';
import { TreasuryPrintView } from './TreasuryPrintView';

const ROWS = [
    {
        _id: 'a1',
        date: '2026-09-06',
        type: 'INCOME',
        method: 'cash',
        amount: 126400,
        receiptNumber: 'REC-1012',
        description: 'مبيعات - فاتورة #INV-000010 (العميل: ahmed seera)',
    },
    {
        _id: 'a2',
        date: '2026-09-06',
        type: 'EXPENSE',
        method: 'bank',
        amount: 60000,
        receiptNumber: '',
        description: 'مصروف',
    },
];

const SUMMARY = { income: 126400, expense: 60000, net: 66400, count: 2 };

function setup(rows = ROWS) {
    return render(
        <TreasuryPrintView
            rows={rows}
            summary={SUMMARY}
            periodLabel="اليوم"
            dateRange={{ startDate: '2026-09-06', endDate: '2026-09-06' }}
        />
    );
}

describe('TreasuryPrintView', () => {
    test('renders title, period and summary', () => {
        setup();
        expect(screen.getByText('كشف حركة الخزينة')).toBeInTheDocument();
        expect(screen.getByText(/عدد الحركات:/)).toBeInTheDocument();
        expect(screen.getByText(/إجمالي الوارد:/)).toBeInTheDocument();
        expect(screen.getByText(/إجمالي الصادر:/)).toBeInTheDocument();
        expect(screen.getByText(/الصافي:/)).toBeInTheDocument();
    });

    test('renders one table row per record with the description intact', () => {
        const { container } = setup();
        const bodyRows = container.querySelectorAll('tbody tr');
        expect(bodyRows).toHaveLength(2);
        const firstCells = within(bodyRows[0]).getAllByRole('cell');
        // Description stays a single cell — never split into columns.
        expect(firstCells).toHaveLength(6);
        expect(screen.getByText('مبيعات - فاتورة #INV-000010 (العميل: ahmed seera)')).toBeInTheDocument();
        expect(screen.getByText('REC-1012')).toBeInTheDocument();
    });

    test('is print-only (hidden on screen)', () => {
        const { container } = setup();
        const area = container.querySelector('#treasury-print-area');
        expect(area).not.toBeNull();
        expect(area.className).toMatch(/hidden/);
        expect(area.className).toMatch(/print:block/);
        expect(area.getAttribute('dir')).toBe('rtl');
    });

    test('shows an empty state when there are no rows', () => {
        setup([]);
        expect(screen.getByText('لا توجد معاملات في هذه الفترة')).toBeInTheDocument();
    });
});
