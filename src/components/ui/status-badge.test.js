import { resolveStatus } from './status-badge';

describe('StatusBadge mapping (UX-071 tripwire)', () => {
    test('resolveStatus maps canonical statuses', () => {
        expect(resolveStatus('paid').variant).toBe('success');
        expect(resolveStatus('pending').variant).toBe('warning');
        expect(resolveStatus('overdue').variant).toBe('destructive');
        expect(resolveStatus('credit').variant).toBe('info');
    });

    test('is case/space tolerant', () => {
        expect(resolveStatus('  PAID ')).toEqual(resolveStatus('paid'));
    });

    test('unknown statuses resolve to null (rendered neutral)', () => {
        expect(resolveStatus('some-future-status')).toBeNull();
        expect(resolveStatus('')).toBeNull();
        expect(resolveStatus(null)).toBeNull();
    });
});
