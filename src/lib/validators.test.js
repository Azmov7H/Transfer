import { expenseSchema, invoiceSchema, productSchema, loginSchema, stockMoveSchema } from '@/validations/validators';
import { customerSchema } from '@/validations/customer.schema';
import { z } from 'zod';

describe('Validators Sanity Check', () => {
    it('should have valid expense schema', () => {
        expect(expenseSchema).toBeDefined();
        const result = expenseSchema.safeParse({
            amount: 100,
            reason: 'Test Expense',
            category: 'General'
        });
        expect(result.success).toBe(true);
    });

    it('should validate invoice schema', () => {
        expect(invoiceSchema).toBeDefined();
        const invalid = invoiceSchema.safeParse({});
        expect(invalid.success).toBe(false);
    });

    it('should validate product schema', () => {
        expect(productSchema).toBeDefined();
    });
});

/**
 * Extended coverage (FE-TEST-003): locks the Arabic-message schemas and the
 * coerce/enum semantics the migrated dialogs depend on (FE-FORM-001).
 */
describe('login schema', () => {
    it('accepts valid credentials', () => {
        const result = loginSchema.safeParse({ email: 'a@b.com', password: 'x' });
        expect(result.success).toBe(true);
    });

    it('rejects a malformed email with the Arabic message', () => {
        const result = loginSchema.safeParse({ email: 'not-an-email', password: 'x' });
        expect(result.success).toBe(false);
        expect(result.error.issues[0].message).toBe('البريد الإلكتروني غير صالح');
    });

    it('requires a password', () => {
        const result = loginSchema.safeParse({ email: 'a@b.com', password: '' });
        expect(result.success).toBe(false);
    });
});

describe('customer schema (FE-FORM-001 pilot)', () => {
    it('accepts a minimal customer and applies defaults', () => {
        const result = customerSchema.safeParse({ name: 'عميل', phone: '0100' });
        expect(result.success).toBe(true);
        if (result.success) {
            expect(result.data.priceType).toBe('retail');
            expect(result.data.creditLimit).toBe(0);
            expect(result.data.financialTrackingEnabled).toBe(true);
        }
    });

    it('requires name and phone with Arabic messages', () => {
        // zod v4: missing keys yield generic "expected string" issues, so the
        // Arabic required-messages are asserted against empty strings.
        const empty = customerSchema.safeParse({ name: '', phone: '' });
        expect(empty.success).toBe(false);
        const messages = empty.error.issues.map(i => i.message);
        expect(messages).toContain('اسم العميل مطلوب');
        expect(messages).toContain('رقم الهاتف مطلوب');

        const missing = customerSchema.safeParse({});
        expect(missing.success).toBe(false);
    });

    it('rejects unknown price types', () => {
        const result = customerSchema.safeParse({
            name: 'عميل', phone: '0100', priceType: 'vip',
        });
        expect(result.success).toBe(false);
    });

    it('coerces numeric strings for credit limit', () => {
        const result = customerSchema.safeParse({
            name: 'عميل', phone: '0100', creditLimit: '500',
        });
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.creditLimit).toBe(500);
    });

    it('trims whitespace from name', () => {
        const result = customerSchema.safeParse({ name: '  عميل  ', phone: '0100' });
        expect(result.success).toBe(true);
        if (result.success) expect(result.data.name).toBe('عميل');
    });
});

describe('stock move schema', () => {
    it('accepts a single-product movement', () => {
        const result = stockMoveSchema.safeParse({ productId: 'abc', qty: 3, type: 'IN' });
        expect(result.success).toBe(true);
    });

    it('accepts bulk items without productId/qty', () => {
        const result = stockMoveSchema.safeParse({
            type: 'TRANSFER_TO_SHOP',
            items: [{ productId: 'a', qty: 1 }, { productId: 'b', qty: 2 }],
        });
        expect(result.success).toBe(true);
    });

    it('rejects movements with neither single product nor items', () => {
        const result = stockMoveSchema.safeParse({ type: 'OUT' });
        expect(result.success).toBe(false);
    });

    it('rejects unknown movement types', () => {
        const result = stockMoveSchema.safeParse({ productId: 'a', qty: 1, type: 'STEAL' });
        expect(result.success).toBe(false);
    });
});
