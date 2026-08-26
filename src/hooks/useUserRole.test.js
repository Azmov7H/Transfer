const { renderHook, waitFor } = require('@testing-library/react');
const React = require('react');
const { QueryClientProvider } = require('@tanstack/react-query');

jest.mock('@/services/authService', () => ({
    getSession: (...args) => mockGetSession(...args),
}));

const { useUserRole } = require('./useUserRole');
const { createTestQueryClient } = require('@/test/utils');

const mockGetSession = jest.fn();

/**
 * Session shape contract (FE-TEST-002): the fetcher unwraps the envelope,
 * so `data` IS the user object — these tests pin that assumption.
 *
 * NOTE: written in CJS style because next/jest's SWC transform only hoists
 * jest.mock() for non-ESM test files.
 */
function hookWithClient() {
    const client = createTestQueryClient();
    const wrapper = ({ children }) => (
        React.createElement(QueryClientProvider, { client }, children)
    );
    return { ...renderHook(() => useUserRole(), { wrapper }), client };
}

describe('useUserRole', () => {
    beforeEach(() => {
        mockGetSession.mockReset();
    });

    it('exposes user and role when a session exists', async () => {
        mockGetSession.mockResolvedValue({ _id: 'u1', name: 'علي', role: 'owner' });
        const { result } = hookWithClient();
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.user).toEqual({ _id: 'u1', name: 'علي', role: 'owner' });
        expect(result.current.role).toBe('owner');
        expect(result.current.isLoggedOut).toBe(false);
        expect(result.current.isError).toBe(false);
    });

    it('flags isLoggedOut only when settled with no user and no error', async () => {
        mockGetSession.mockResolvedValue(null);
        const { result } = hookWithClient();
        await waitFor(() => expect(result.current.loading).toBe(false));
        expect(result.current.user).toBeNull();
        expect(result.current.isLoggedOut).toBe(true);
    });

    it('does not flag isLoggedOut on fetch error (ambiguous state)', async () => {
        mockGetSession.mockRejectedValue(new Error('network down'));
        const { result } = hookWithClient();
        // hook sets retry:1 → one backoff attempt (~1s) before settling as error
        await waitFor(() => expect(result.current.isError).toBe(true), { timeout: 4000 });
        expect(result.current.isLoggedOut).toBe(false);
        expect(result.current.role).toBeNull();
    });
});
