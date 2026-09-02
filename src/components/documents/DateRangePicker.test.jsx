/**
 * DateRangePicker + DocumentTable tests.
 *
 * DateRangePicker (T-FE-DOC-007):
 *  - presets populate the value
 *  - custom range echoes the input
 *  - maxDays surfaces a warning
 *  - toYmd / rangeTooLong helpers
 *
 * DocumentTable (T-FE-DOC-008):
 *  - renders headers + rows
 *  - shows the empty state when rows is empty
 *  - renders the totals row when totals is provided
 *  - fires onRowClick with the row payload
 *  - per-column render function wins
 */
import { fireEvent, render, screen, within } from '@testing-library/react';
import { DateRangePicker, __testInternals } from './DateRangePicker';
import { DocumentTable } from './DocumentTable';

const { presetRange, rangeTooLong, toYmd } = __testInternals;

describe('DateRangePicker — helpers', () => {
    test('toYmd formats a Date as yyyy-MM-dd', () => {
        expect(toYmd(new Date('2026-08-30T12:00:00Z'))).toBe('2026-08-30');
    });

    test('toYmd returns empty string for null/invalid', () => {
        expect(toYmd(null)).toBe('');
        expect(toYmd('not-a-date')).toBe('');
    });

    test('rangeTooLong respects the cap', () => {
        expect(rangeTooLong('2026-01-01', '2026-12-31', 365)).toBe(false);
        expect(rangeTooLong('2025-01-01', '2026-12-31', 365)).toBe(true);
        expect(rangeTooLong('2026-01-01', '', 365)).toBe(false);
    });

    test('presetRange("today") returns today as both endpoints', () => {
        const r = presetRange('today');
        expect(r.from).toMatch(/^\d{4}-\d{2}-\d{2}$/);
        expect(r.to).toBe(r.from);
    });

    test('presetRange("lastMonth") returns a closed previous month', () => {
        const r = presetRange('lastMonth');
        // From must be the 1st of the previous month.
        expect(r.from).toMatch(/-\d{2}-01$/);
    });

    test('presetRange("custom") returns null (no auto-fill)', () => {
        expect(presetRange('custom')).toBeNull();
    });
});

describe('DateRangePicker — component', () => {
    test('renders the summary placeholder when empty', () => {
        render(<DateRangePicker value={{}} onChange={() => {}} />);
        expect(screen.getByText('اختر الفترة')).toBeInTheDocument();
    });

    test('renders a compact summary when from + to are set', () => {
        render(
            <DateRangePicker
                value={{ from: '2026-01-01', to: '2026-12-31' }}
                onChange={() => {}}
            />
        );
        expect(screen.getByText('2026-01-01 → 2026-12-31')).toBeInTheDocument();
    });

    test('shows a warning when the range exceeds maxDays', () => {
        render(
            <DateRangePicker
                value={{ from: '2025-01-01', to: '2026-12-31' }}
                onChange={() => {}}
                maxDays={365}
            />
        );
        // Open the popover so the warning becomes visible.
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('date-range-warning')).toBeInTheDocument();
    });

    test('emits the new value when a preset is clicked (opens popover)', () => {
        const onChange = jest.fn();
        render(<DateRangePicker value={{}} onChange={onChange} />);
        // The popover content is rendered behind Radix portal — fire the
        // button click to open it, then click the "هذا الشهر" preset.
        // For a unit test we can directly call the component's preset
        // handler via the keyboard, but the simpler check is that the
        // popover is wired to Radix Popover (tested via the rendered
        // trigger). Click the trigger to open:
        const trigger = screen.getByRole('button');
        fireEvent.click(trigger);
        // Preset buttons live inside the popover content (portal):
        const preset = screen.getByText('هذا الشهر');
        fireEvent.click(preset);
        expect(onChange).toHaveBeenCalled();
        const arg = onChange.mock.calls[0][0];
        expect(arg.from).toMatch(/^\d{4}-\d{2}-01$/);
        expect(arg.to).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    test('respects a custom presets allow-list', () => {
        render(
            <DateRangePicker
                value={{}}
                onChange={() => {}}
                presets={['today', 'thisMonth']}
            />
        );
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByText('اليوم')).toBeInTheDocument();
        expect(screen.getByText('هذا الشهر')).toBeInTheDocument();
        // Not in the list:
        expect(screen.queryByText('أمس')).not.toBeInTheDocument();
    });

    test('echoes the custom date input value', () => {
        const onChange = jest.fn();
        render(<DateRangePicker value={{ from: '', to: '' }} onChange={onChange} />);
        fireEvent.click(screen.getByRole('button'));
        const fromInput = screen.getAllByDisplayValue('').find(
            (el) => el.getAttribute('type') === 'date'
        );
        fireEvent.change(fromInput, { target: { value: '2026-08-01' } });
        expect(onChange).toHaveBeenCalledWith({ from: '2026-08-01', to: '' });
    });
});

describe('DocumentTable', () => {
    const cols = [
        { key: 'name', header: 'الاسم' },
        { key: 'qty',  header: 'الكمية', align: 'center' },
        { key: 'price', header: 'السعر', align: 'left' },
    ];

    test('renders headers + rows', () => {
        render(
            <DocumentTable
                columns={cols}
                rows={[
                    { id: 1, name: 'A', qty: 2, price: 10 },
                    { id: 2, name: 'B', qty: 3, price: 20 },
                ]}
            />
        );
        const table = screen.getByTestId('document-table');
        expect(within(table).getByText('الاسم')).toBeInTheDocument();
        expect(within(table).getByText('A')).toBeInTheDocument();
        expect(within(table).getByText('B')).toBeInTheDocument();
        expect(within(table).getByText('20')).toBeInTheDocument();
    });

    test('shows the empty state when rows is empty', () => {
        render(<DocumentTable columns={cols} rows={[]} />);
        expect(screen.getByText('لا توجد بيانات لعرضها')).toBeInTheDocument();
    });

    test('respects a custom emptyMessage', () => {
        render(<DocumentTable columns={cols} rows={[]} emptyMessage="فارغ" />);
        expect(screen.getByText('فارغ')).toBeInTheDocument();
    });

    test('renders the totals row when totals is provided', () => {
        render(
            <DocumentTable
                columns={cols}
                rows={[{ id: 1, name: 'A', qty: 2, price: 10 }]}
                totals={{ name: 'الإجمالي', qty: 2, price: 10 }}
            />
        );
        const table = screen.getByTestId('document-table');
        // totals row shows the __label or default in the first cell.
        expect(within(table).getByText('الإجمالي')).toBeInTheDocument();
    });

    test('fires onRowClick with the row payload', () => {
        const onRowClick = jest.fn();
        render(
            <DocumentTable
                columns={cols}
                rows={[{ id: 1, name: 'A', qty: 2, price: 10 }]}
                onRowClick={onRowClick}
            />
        );
        const table = screen.getByTestId('document-table');
        const cell = within(table).getByText('A');
        fireEvent.click(cell.closest('tr'));
        expect(onRowClick).toHaveBeenCalledWith(
            expect.objectContaining({ id: 1, name: 'A' })
        );
    });

    test('per-column render wins over the raw value', () => {
        render(
            <DocumentTable
                columns={[
                    { key: 'name', header: 'الاسم' },
                    {
                        key: 'status', header: 'الحالة',
                        render: (r) => <span data-testid="status-badge">{r.status}</span>,
                    },
                ]}
                rows={[{ id: 1, name: 'A', status: 'مدفوع' }]}
            />
        );
        expect(screen.getByTestId('status-badge')).toHaveTextContent('مدفوع');
    });

    test('renders a screen-reader caption', () => {
        render(
            <DocumentTable
                columns={cols}
                rows={[]}
                caption="كشف حساب عميل"
            />
        );
        // <caption> is sr-only but still present in the DOM.
        const table = screen.getByTestId('document-table');
        const caption = table.querySelector('caption');
        expect(caption).toHaveTextContent('كشف حساب عميل');
    });
});
