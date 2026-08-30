/**
 * CSV serializer unit tests (FIN-UI-017).
 *
 * Locks the shared quoting/BOM behavior of buildCsv used by both the
 * accounting page export and the ExportButton server response handling.
 */

const { buildCsv, escapeCsvCell } = require('./exportCsv');

describe('buildCsv', () => {
    test('prepends UTF-8 BOM for Arabic support', () => {
        const csv = buildCsv([['مبيعات', 100]]);
        expect(csv.startsWith('\uFEFF')).toBe(true);
    });

    test('writes headers followed by rows', () => {
        const csv = buildCsv(
            [['علي', 500], ['سارة', 250]],
            ['الاسم', 'المبلغ']
        );
        const lines = csv.replace('\uFEFF', '').split('\n');
        expect(lines).toHaveLength(3);
        expect(lines[0]).toBe('الاسم,المبلغ');
        expect(lines[1]).toBe('علي,500');
        expect(lines[2]).toBe('سارة,250');
    });

    test('quotes cells containing commas, quotes or newlines', () => {
        expect(escapeCsvCell('a,b')).toBe('"a,b"');
        expect(escapeCsvCell('say "hi"')).toBe('"say ""hi"""');
        expect(escapeCsvCell('line\nbreak')).toBe('"line\nbreak"');
        expect(escapeCsvCell(12)).toBe('12');
        expect(escapeCsvCell(null)).toBe('');
        expect(escapeCsvCell(undefined)).toBe('');
    });
});
