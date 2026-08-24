'use client';

import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { SmartCombobox } from '@/components/ui/smart-combobox';
import { Badge } from '@/components/ui/badge';
import { Info, RefreshCw, ArrowUpRight, History, Barcode, Loader2 } from 'lucide-react';

import { FormField, mapServerFieldErrors } from '@/components/forms/FormField';
import { zodResolver } from '@/components/forms/zodResolver';
import { productSchema } from '@/validations/product.schema';

// Helper to generate EAN-13 style barcode
const generateBarcode = () => {
    return Math.floor(Math.random() * 9000000000000) + 1000000000000; // 13 digits
};

export function ProductFormDialog({ open, onOpenChange, mode, defaultValues, onSubmit, isPending, metadata, productName }) {
    const {
        register,
        handleSubmit,
        control,
        reset,
        setValue,
        watch,
        setError,
        formState: { errors, isSubmitting }
    } = useForm({
        resolver: zodResolver(productSchema),
        defaultValues
    });

    useEffect(() => {
        if (open) {
            reset(defaultValues);
            if (mode === 'add' && !watch('code')) {
                setValue('code', generateBarcode().toString());
            }
        }
    }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

    const handleRegenerateBarcode = () => {
        setValue('code', generateBarcode().toString(), { shouldValidate: false });
    };

    const onValid = async (values) => {
        try {
            await onSubmit(values);
        } catch (err) {
            const serverErrors = mapServerFieldErrors(err);
            if (serverErrors) {
                Object.entries(serverErrors).forEach(([field, error]) => setError(field, error));
            } else {
                throw err;
            }
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[90vw] max-w-[90vw] sm:max-w-[800px] h-[90vh] md:h-[80vh] overflow-y-auto glass-card border-white/10 p-0 rounded-3xl" dir="rtl">
                <form onSubmit={handleSubmit(onValid)} noValidate>
                    <div className="p-4 md:p-8 space-y-6 md:space-y-8">
                        <div className="space-y-2">
                            <DialogTitle className="text-2xl font-black">
                                {mode === 'add' ? 'إضافة منتج جديد' : `تعديل: ${productName}`}
                            </DialogTitle>
                            <DialogDescription className="font-medium">
                                أدخل بيانات المنتج بدقة لضمان دقة التقارير المالية والمخزنية.
                            </DialogDescription>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Basic Info Section */}
                            <div className="space-y-6">
                                <div className="space-y-4">
                                    <h3 className="flex items-center gap-2 font-black text-primary text-sm uppercase tracking-wider">
                                        <Info className="h-4 w-4" /> المعلومات الأساسية
                                    </h3>

                                    <div className="grid grid-cols-1 gap-4">
                                        <FormField label="اسم المنتج" required error={errors.name}>
                                            <Input
                                                {...register('name')}
                                                className="h-12 rounded-xl bg-white/5 border-white/5 font-bold"
                                                placeholder="اسم المنتج بالكامل..."
                                                aria-invalid={!!errors.name}
                                            />
                                        </FormField>
                                        <FormField label="كود المنتج (الباركود)" required error={errors.code}>
                                            <div className="relative flex gap-2">
                                                <div className="relative flex-1">
                                                    <Barcode className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                                    <Input
                                                        {...register('code')}
                                                        className="h-12 pr-12 rounded-xl bg-white/5 border-white/5 font-mono font-bold"
                                                        placeholder="امسح أو اكتب الكود..."
                                                        aria-invalid={!!errors.code}
                                                    />
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={handleRegenerateBarcode}
                                                    className="h-12 w-12 rounded-xl bg-white/5 hover:bg-primary/20 hover:text-primary transition-colors"
                                                    aria-label="توليد كود تلقائي"
                                                    title="توليد كود تلقائي"
                                                >
                                                    <RefreshCw className="h-5 w-5" />
                                                </Button>
                                            </div>
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField label="الماركة" error={errors.brand}>
                                            <Controller
                                                control={control}
                                                name="brand"
                                                render={({ field }) => (
                                                    <SmartCombobox
                                                        options={metadata.brands}
                                                        value={field.value ?? ''}
                                                        onChange={field.onChange}
                                                        onCreate={(val) => field.onChange(val)}
                                                        placeholder="اختر الماركة..."
                                                        className="h-12 rounded-xl"
                                                    />
                                                )}
                                            />
                                        </FormField>
                                        <FormField label="الفئة" error={errors.category}>
                                            <Controller
                                                control={control}
                                                name="category"
                                                render={({ field }) => (
                                                    <SmartCombobox
                                                        options={metadata.categories}
                                                        value={field.value ?? ''}
                                                        onChange={field.onChange}
                                                        onCreate={(val) => field.onChange(val)}
                                                        placeholder="الفئة الرئيسية..."
                                                        className="h-12 rounded-xl"
                                                    />
                                                )}
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField label="القسم الفرعي" error={errors.subsection}>
                                            <Input
                                                {...register('subsection')}
                                                className="h-12 rounded-xl bg-white/5 border-white/5"
                                            />
                                        </FormField>
                                        <FormField label="الموسم" error={errors.season}>
                                            <Input
                                                {...register('season')}
                                                className="h-12 rounded-xl bg-white/5 border-white/5"
                                            />
                                        </FormField>
                                    </div>
                                </div>
                            </div>

                            {/* Inventory & Pricing Section */}
                            <div className="space-y-6">
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/10 space-y-6">
                                    <h3 className="flex items-center gap-2 font-black text-primary text-sm uppercase tracking-wider">
                                        <ArrowUpRight className="h-4 w-4" /> التسعير والمخزون
                                    </h3>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField label="سعر البيع (قطاعي)" required error={errors.retailPrice}>
                                            <Input
                                                type="number"
                                                {...register('retailPrice')}
                                                className="h-14 rounded-2xl bg-white/10 border-primary/20 text-center font-black text-xl text-primary"
                                                aria-invalid={!!errors.retailPrice}
                                            />
                                        </FormField>
                                        <FormField label="سعر التكلفة" error={errors.buyPrice}>
                                            <Input
                                                type="number"
                                                {...register('buyPrice')}
                                                className="h-14 rounded-2xl bg-white/5 border-white/5 text-center font-bold text-lg"
                                            />
                                        </FormField>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <FormField label="هامش ربح أدنى (%)" error={errors.minProfitMargin}>
                                            <Input
                                                type="number"
                                                {...register('minProfitMargin')}
                                                className="h-11 rounded-xl bg-white/5 border-white/5 text-center"
                                            />
                                        </FormField>
                                        <FormField label="حد الطلب (Minimum)" error={errors.minLevel}>
                                            <Input
                                                type="number"
                                                {...register('minLevel')}
                                                className="h-11 rounded-xl bg-white/5 border-white/5 text-center"
                                            />
                                        </FormField>
                                    </div>
                                </div>

                                {/* Handover Section - ONLY on Add Mode */}
                                {mode === 'add' && (
                                    <div className="p-6 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 space-y-4">
                                        <div className="flex items-center justify-between">
                                            <h3 className="flex items-center gap-2 font-black text-emerald-500 text-sm uppercase tracking-wider">
                                                <History className="h-4 w-4" /> الرصيد الافتتاحي
                                            </h3>
                                            <Badge className="bg-emerald-500/20 text-emerald-500 border-emerald-500/30 text-[9px] font-black uppercase">التسجيل الأول</Badge>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <FormField label="الكمية بالمخزن" error={errors.warehouseQty}>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...register('warehouseQty')}
                                                    className="h-12 rounded-xl bg-white/5 border-emerald-500/20 text-center font-bold"
                                                />
                                            </FormField>
                                            <FormField label="الكمية بالمحل" error={errors.shopQty}>
                                                <Input
                                                    type="number"
                                                    placeholder="0"
                                                    {...register('shopQty')}
                                                    className="h-12 rounded-xl bg-white/5 border-emerald-500/20 text-center font-bold"
                                                />
                                            </FormField>
                                        </div>
                                        <p className="text-[10px] text-muted-foreground font-medium bg-emerald-500/5 p-2 rounded-lg leading-relaxed">
                                            💡 هذه هي الكميات التي يتم تسجيلها لأول مرة عند استلام المحل للنظام. سيتم إنشاء حركة &quot;رصيد افتتاحي&quot; آلياً بهذه القيم.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6 md:pt-8 border-t border-white/5">
                            <div className="flex items-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
                                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                                <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">النظام جاهز للتسجيل</span>
                            </div>
                            <div className="flex gap-4 w-full sm:w-auto">
                                <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1 sm:flex-none h-12 px-8 rounded-2xl border-white/10 hover:bg-white/5 font-bold">
                                    إلغاء
                                </Button>
                                <Button type="submit" disabled={isPending || isSubmitting} className="flex-1 sm:flex-none h-12 px-12 rounded-2xl bg-primary text-primary-foreground font-black shadow-lg shadow-primary/20">
                                    {isPending ? <Loader2 className="animate-spin" /> : (mode === 'add' ? 'إضافة المنتج' : 'حفظ التغييرات')}
                                </Button>
                            </div>
                        </div>
                    </div>
                </form>
            </DialogContent>
        </Dialog >
    );
}
