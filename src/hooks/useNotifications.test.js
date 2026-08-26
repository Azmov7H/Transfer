/**
 * FE-DATA-004 regression lock: notification polling must be gated by the
 * session — no fetches (and therefore no 401 churn) while logged out.
 *
 * CJS style — required for jest.mock hoisting under next/jest (SWC).
 */
jest.mock('@/services/notificationService', () => ({
    getNotifications: (...args) => mockGetNotifications(...args),
    markNotificationsRead: jest.fn(),
    deleteNotification: jest.fn(),
}));

jest.mock('./useUserRole', () => ({
    useUserRole: () => mockUserRole(),
}));

const { renderHook, waitFor } = require('@testing-library/react');
const React = require('react');
const { QueryClientProvider } = require('@tanstack/react-query');
const { useNotifications } = require('./useNotifications');
const { createTestQueryClient } = require('@/test/utils');

const mockGetNotifications = jest.fn();
const mockUserRole = jest.fn();

function hookWithClient() {
    const client = createTestQueryClient();
    const wrapper = ({ children }) => (
        React.createElement(QueryClientProvider, { client }, children)
    );
    return { ...renderHook(() => useNotifications(), { wrapper }), client };
}

describe('useNotifications — session gating', () => {
    beforeEach(() => {
        mockGetNotifications.mockReset();
        mockGetNotifications.mockResolvedValue({
            notifications: [{ _id: 'n1' }],
            unreadCount: 1,
        });
    });

    it('never fetches while logged out', async () => {
        mockUserRole.mockReturnValue({ user: null });
        const { result } = hookWithClient();

        await new Promise((r) => setTimeout(r, 50));
        expect(mockGetNotifications).not.toHaveBeenCalled();
        expect(result.current.notifications).toEqual([]);
        expect(result.current.unreadCount).toBe(0);
    });

    it('fetches and maps counts when a session exists', async () => {
        mockUserRole.mockReturnValue({ user: { _id: 'u1', role: 'owner' } });
        const { result } = hookWithClient();

        await waitFor(() => expect(mockGetNotifications).toHaveBeenCalled());
        await waitFor(() => expect(result.current.notifications).toHaveLength(1));
        expect(result.current.unreadCount).toBe(1);
    });
});
