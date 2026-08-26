'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    CreditCard,
    HandCoins,
    Settings2
} from 'lucide-react';
import { TabHeader } from './TabHeader';

export function DefaultsSettingsTab({ settings, onChange }) {
    const set = (patch) => onChange({ ...settings, ...patch });

    return (
        <div className="glass-card shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/10 rounded-[3rem] overflow-hidden animate-in zoom-in-95 duration-700">
            <div className="p-12">
                <TabHeader
                    icon={Settings2}
                    title="القيم الافتراضية والتحكم"
                    description="قواعد العمل التلقائية للديون والتحصيلات"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mt-10">
                    <div className="space-y-10">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/20 shadow-inner">
                                <CreditCard size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">فترات السداد الآلي</h3>
                                <p className="text-sm font-bold text-white/20">تُطبق تلقائياً عند إنشاء الفواتير والمشتريات</p>
                            </div>
                        </div>

                        <div className="space-y-8 pr-6 border-r-4 border-white/5">
                            <div className="space-y-4 group">
                                <Label className="text-sm font-black text-white/30 uppercase tracking-[0.2em] flex items-center justify-between">
                                    استحقاق العميل (المبيعات)
                                    <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">STANDARD TERMS</span>
                                </Label>
                                <div className="flex items-center gap-4 bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 group-hover:bg-white/[0.05] transition-all">
                                    <Input
                                        type="number"
                                        value={settings.defaultCustomerTerms || 0}
                                        onChange={e => set({ defaultCustomerTerms: parseInt(e.target.value) || 0 })}
                                        className="h-10 text-3xl font-black border-0 bg-transparent text-white ring-0 focus-visible:ring-0 tabular-nums text-center"
                                    />
                                    <span className="text-xs font-black text-white/10 uppercase tracking-widest">يوم</span>
                                </div>
                            </div>

                            <div className="space-y-4 group">
                                <Label className="text-sm font-black text-white/30 uppercase tracking-[0.2em] flex items-center justify-between">
                                    موعد التوريد (المشتريات)
                                    <span className="text-xs bg-primary/20 text-primary px-3 py-1 rounded-full">EXPECTED DELIVERY</span>
                                </Label>
                                <div className="flex items-center gap-4 bg-white/[0.03] p-6 rounded-[2rem] border border-white/5 group-hover:bg-white/[0.05] transition-all">
                                    <Input
                                        type="number"
                                        value={settings.defaultSupplierTerms || 0}
                                        onChange={e => set({ defaultSupplierTerms: parseInt(e.target.value) || 0 })}
                                        className="h-10 text-3xl font-black border-0 bg-transparent text-white ring-0 focus-visible:ring-0 tabular-nums text-center"
                                    />
                                    <span className="text-xs font-black text-white/10 uppercase tracking-widest">يوم</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-10">
                        <div className="flex items-center gap-5">
                            <div className="h-14 w-14 bg-amber-500/10 rounded-2xl flex items-center justify-center text-amber-500 border border-amber-500/20 shadow-inner">
                                <HandCoins size={28} />
                            </div>
                            <div>
                                <h3 className="text-2xl font-black tracking-tight">إدارة مبالغ التنبيه</h3>
                                <p className="text-sm font-bold text-white/20">تصفية التنبيهات الصغيرة لزيادة الفعالية</p>
                            </div>
                        </div>

                        <div className="space-y-8 pr-6 border-r-4 border-amber-500/10">
                            <div className="space-y-4">
                                <Label className="text-sm font-black text-amber-500/40 uppercase tracking-[0.2em]">الحد الأدنى لقيمة التنبيه</Label>
                                <div className="relative group">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-amber-500/20 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-500 animate-pulse w-[30%]" />
                                    </div>
                                    <div className="flex items-center gap-4 bg-amber-500/5 p-8 rounded-[2.5rem] border border-amber-500/10 transition-all">
                                        <Input
                                            type="number"
                                            value={settings.minDebtNotificationAmount || 0}
                                            onChange={e => set({ minDebtNotificationAmount: parseInt(e.target.value) || 0 })}
                                            className="h-12 text-5xl font-black text-center border-0 bg-transparent text-amber-500 ring-0 focus-visible:ring-0 tabular-nums"
                                        />
                                        <span className="text-xl font-black text-amber-500/20">ج.م</span>
                                    </div>
                                </div>
                                <p className="text-xs text-white/20 font-bold leading-relaxed pr-2 italic">
                                    سيتم تجاهل أي مديونية أقل من هذا المبلغ في قائمة الإشعارات السريعة.
                                </p>
                            </div>

                            <div className="p-8 rounded-[2.5rem] bg-white/[0.03] border border-dashed border-white/10 flex items-start gap-4">
                                <div className="h-3 w-3 rounded-full bg-amber-500 mt-1 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                                <p className="text-xs font-bold leading-relaxed text-white/30">
                                    تلميح: ربط وسيلة الدفع بالنظام يسمح بحساب صافي الربح بدقة متناهية بناءً على التكاليف المدخلة أعلاه.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
