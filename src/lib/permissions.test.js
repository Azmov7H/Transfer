import { describe, it, expect } from '@jest/globals';
import { ROLES, hasPermission, can, hasRole, PERMISSIONS } from './permissions';

/**
 * Permissions matrix (FE-TEST-002) — locks the AUTH-002 role-model fix.
 */
describe('permissions', () => {
    describe('hasPermission / can', () => {
        it('owner passes everything via wildcard', () => {
            for (const perm of ['dashboard:view', 'users:manage', 'anything:else']) {
                expect(hasPermission(ROLES.OWNER, perm)).toBe(true);
            }
        });

        it('null/unknown roles are denied', () => {
            expect(hasPermission(null, 'dashboard:view')).toBe(false);
            expect(hasPermission(undefined, 'products:view')).toBe(false);
            expect(hasPermission('ghost', 'products:view')).toBe(false);
        });

        it('manager has management permissions but not wildcard-only areas', () => {
            expect(can(ROLES.MANAGER, 'financial:manage')).toBe(true);
            expect(can(ROLES.MANAGER, 'users:manage')).toBe(true);
            expect(can(ROLES.MANAGER, 'invoices:create')).toBe(false);
        });

        it('cashier can create invoices but not manage stock or users', () => {
            expect(can(ROLES.CASHIER, 'invoices:create')).toBe(true);
            expect(can(ROLES.CASHIER, 'stock:manage')).toBe(false);
            expect(can(ROLES.CASHIER, 'users:manage')).toBe(false);
        });

        it('warehouse manages stock/transfers and may view audit, not financials', () => {
            expect(can(ROLES.WAREHOUSE, 'stock:manage')).toBe(true);
            expect(can(ROLES.WAREHOUSE, 'transfers:manage')).toBe(true);
            expect(can(ROLES.WAREHOUSE, 'audit:manage')).toBe(true);
            expect(can(ROLES.WAREHOUSE, 'financial:view')).toBe(false);
        });

        it('viewer is read-only', () => {
            for (const perm of PERMISSIONS[ROLES.VIEWER]) {
                expect(hasPermission(ROLES.VIEWER, perm)).toBe(true);
            }
            expect(can(ROLES.VIEWER, 'products:manage')).toBe(false);
            expect(can(ROLES.VIEWER, 'invoices:create')).toBe(false);
        });

        it('every declared role resolves its permission list', () => {
            expect(Object.keys(PERMISSIONS)).toHaveLength(5);
            for (const list of Object.values(PERMISSIONS)) {
                expect(Array.isArray(list)).toBe(true);
                expect(list.length).toBeGreaterThan(0);
            }
        });
    });

    describe('hasRole', () => {
        it('matches membership and rejects empty input', () => {
            expect(hasRole(ROLES.OWNER, [ROLES.OWNER, ROLES.MANAGER])).toBe(true);
            expect(hasRole(ROLES.CASHIER, [ROLES.OWNER, ROLES.MANAGER])).toBe(false);
            expect(hasRole(null, [ROLES.OWNER])).toBe(false);
            expect(hasRole(ROLES.OWNER, null)).toBe(false);
        });
    });
});
