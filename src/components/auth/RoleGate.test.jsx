/**
 * RoleGate contract (FE-AUTH-002): loading spinner while session resolves,
 * children only for authorized sessions, Arabic unauthorized fallback otherwise.
 *
 * CJS style — required for jest.mock hoisting under next/jest (SWC).
 */
jest.mock('@/hooks/useUserRole', () => ({
    useUserRole: jest.fn(),
}));

const React = require('react');
const { screen } = require('@testing-library/react');
const { ROLES } = require('@/lib/permissions');
const { useUserRole } = require('@/hooks/useUserRole');
const { RoleGate } = require('./RoleGate');
const { renderWithProviders } = require('@/test/utils');

describe('RoleGate', () => {
    it('renders a loading indicator while the session resolves', () => {
        useUserRole.mockReturnValue({ role: null, loading: true });
        renderWithProviders(
            React.createElement(RoleGate, { roles: [ROLES.OWNER] }, React.createElement('p', null, 'secret'))
        );
        expect(screen.queryByText('secret')).not.toBeInTheDocument();
        expect(document.querySelector('.animate-spin')).toBeInTheDocument();
    });

    it('renders children when role matches', () => {
        useUserRole.mockReturnValue({ role: ROLES.OWNER, loading: false });
        renderWithProviders(
            React.createElement(RoleGate, { roles: [ROLES.OWNER] }, React.createElement('p', null, 'secret'))
        );
        expect(screen.getByText('secret')).toBeInTheDocument();
        expect(screen.queryByText('ليس لديك صلاحية')).not.toBeInTheDocument();
    });

    it('shows default Arabic fallback when role is not allowed', () => {
        useUserRole.mockReturnValue({ role: ROLES.CASHIER, loading: false });
        renderWithProviders(
            React.createElement(RoleGate, { roles: [ROLES.OWNER] }, React.createElement('p', null, 'secret'))
        );
        expect(screen.getByText('ليس لديك صلاحية')).toBeInTheDocument();
        expect(screen.queryByText('secret')).not.toBeInTheDocument();
    });

    it('checks permission strings via can()', () => {
        useUserRole.mockReturnValue({ role: ROLES.CASHIER, loading: false });
        const { rerender } = renderWithProviders(
            React.createElement(RoleGate, { permission: 'invoices:create' }, React.createElement('p', null, 'invoice-form'))
        );
        expect(screen.getByText('invoice-form')).toBeInTheDocument();

        rerender(
            React.createElement(RoleGate, { permission: 'users:manage' }, React.createElement('p', null, 'admin-panel'))
        );
        expect(screen.queryByText('admin-panel')).not.toBeInTheDocument();
    });

    it('honors a custom fallback node', () => {
        useUserRole.mockReturnValue({ role: null, loading: false });
        renderWithProviders(
            React.createElement(
                RoleGate,
                { roles: [ROLES.OWNER], fallback: React.createElement('p', null, 'custom-deny') },
                React.createElement('p', null, 'secret')
            )
        );
        expect(screen.getByText('custom-deny')).toBeInTheDocument();
    });

    it('allows any known role when no restriction is passed', () => {
        useUserRole.mockReturnValue({ role: ROLES.VIEWER, loading: false });
        renderWithProviders(
            React.createElement(RoleGate, null, React.createElement('p', null, 'shared'))
        );
        expect(screen.getByText('shared')).toBeInTheDocument();
    });
});
