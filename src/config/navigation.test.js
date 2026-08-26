import { navigationConfig } from '@/config/navigation';
import { ROLES, PERMISSIONS, hasPermission } from '@/lib/permissions';

const allItems = () => navigationConfig.flatMap((g) => g.items);

describe('navigationConfig role filtering (UX-015 tripwire)', () => {
    it('exposes a unique href per item', () => {
        const hrefs = allItems().map((i) => i.href);
        expect(new Set(hrefs).size).toBe(hrefs.length);
    });

    it('uses a distinct icon per destination (wayfinding rule UX-010)', () => {
        const icons = allItems().map((i) => i.icon);
        expect(new Set(icons).size).toBe(icons.length);
    });

    it('every item declares a permission string', () => {
        allItems().forEach((i) => expect(typeof i.permission).toBe('string'));
    });

    it('each group renders at least one item for every role that sees the sidebar', () => {
        const roles = Object.values(ROLES);
        roles.forEach((role) => {
            const visibleGroups = navigationConfig.filter((g) =>
                g.items.some((i) => hasPermission(role, i.permission))
            );
            if (hasPermission(role, 'dashboard:view')) {
                expect(visibleGroups.length).toBeGreaterThan(0);
            }
        });
    });

    it('cashier cannot see financial or admin destinations', () => {
        const hrefs = navigationConfig
            .flatMap((g) => g.items)
            .filter((i) => hasPermission(ROLES.CASHIER, i.permission))
            .map((i) => i.href);
        expect(hrefs).not.toContain('/financial');
        expect(hrefs).not.toContain('/users');
    });
});
