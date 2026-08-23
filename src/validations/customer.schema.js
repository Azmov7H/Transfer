import { z } from 'zod';

export const customerSchema = z.object({
    name: z.string().min(1, 'اسم العميل مطلوب').trim(),
    phone: z.string().min(1, 'رقم الهاتف مطلوب').trim(),
    priceType: z.enum(['retail', 'wholesale', 'special']).default('retail'),
    address: z.string().optional(),
    creditLimit: z.coerce.number().min(0, 'حد الائتمان غير صالح').default(0),
    notes: z.string().optional(),
    financialTrackingEnabled: z.boolean().default(true),
    collectionDay: z.string().default('None'),
    paymentTerms: z.coerce.number().int().min(0, 'فترة السداد غير صالحة').default(0),
    openingBalance: z.coerce.number().min(0).optional(),
    openingBalanceType: z.enum(['debit', 'credit']).default('debit'),
    shippingCompany: z.string().optional(),
});
