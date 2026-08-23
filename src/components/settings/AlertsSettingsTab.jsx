'use client';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Package,
    Calendar,
    Users,
    Bell
} from 'lucide-react';
import { TabHeader } from './TabHeader';

export function AlertsSettingsTab({ settings, onChange }) {
    const set = (patch) => onChange({ ...settings, ...patch });

    return (
        <div className="glass-card shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/10 rounded-[3rem] overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
            <div className="p-12">
                <TabHeader
                    icon={Bell}
                    title="إشعارات النظام الذكية"
                    description="إدارة حدود المخزون وتذكيرات السداد التلقائي"
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10">
                    <div className="group space-y-6 p-8 rounded-[2.5rem] bg-amber-500/5 border border-amber-500/10 hover:bg-amber-500/10 transition-all duration-300">
                        <div className="h-16 w-16 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-500 shadow-lg shadow-amber-500/10 group-hover:rotate-6 transition-transform">
                            <Package size={32} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xl font-black text-amber-100 block">حد المخزون الحرج</Label>
                            <p className="text-sm font-bold text-amber-500/50 leading-relaxed">أقل كمية للمنتج قبل إطلاق تنبيه &quot;نقص المخزون&quot;</p>
                        </div>
                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl">
                            <Input
                                type="number"
                                value={settings.stockAlertThreshold || 0}
                                onChange={e => set({ stockAlertThreshold: parseInt(e.target.value) || 0 })}
                                className="h-12 w-24 text-2xl font-black text-center border-0 bg-transparent text-amber-500 ring-0 focus-visible:ring-0"
                            />
                            <span className="font-black text-amber-500/30 uppercase text-xs tracking-[0.3em]">وحدة</span>
                        </div>
                    </div>

                    <div className="group space-y-6 p-8 rounded-[2.5rem] bg-blue-500/5 border border-blue-500/10 hover:bg-blue-500/10 transition-all duration-300">
                        <div className="h-16 w-16 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-500/10 group-hover:rotate-6 transition-transform">
                            <Calendar size={32} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xl font-black text-blue-100 block">تنبيه توريد الموردين</Label>
                            <p className="text-sm font-bold text-blue-500/50 leading-relaxed">تذكير بموعد وصول الشحنات المنتظرة</p>
                        </div>
                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl">
                            <Input
                                type="number"
                                value={settings.supplierPaymentAlertDays || 0}
                                onChange={e => set({ supplierPaymentAlertDays: parseInt(e.target.value) || 0 })}
                                className="h-12 w-24 text-2xl font-black text-center border-0 bg-transparent text-blue-500 ring-0 focus-visible:ring-0"
                            />
                            <span className="font-black text-blue-500/30 uppercase text-xs tracking-[0.3em]">أيام</span>
                        </div>
                    </div>

                    <div className="group space-y-6 p-8 rounded-[2.5rem] bg-emerald-500/5 border border-emerald-500/10 hover:bg-emerald-500/10 transition-all duration-300">
                        <div className="h-16 w-16 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-500 shadow-lg shadow-emerald-500/10 group-hover:rotate-6 transition-transform">
                            <Users size={32} />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-xl font-black text-emerald-100 block">تنبيه تحصيل العملاء</Label>
                            <p className="text-sm font-bold text-emerald-500/50 leading-relaxed">تنبيه قبل حلول موعد استحقاق المديونية</p>
                        </div>
                        <div className="flex items-center gap-4 bg-black/20 p-4 rounded-2xl">
                            <Input
                                type="number"
                                value={settings.customerCollectionAlertDays || 0}
                                onChange={e => set({ customerCollectionAlertDays: parseInt(e.target.value) || 0 })}
                                className="h-12 w-24 text-2xl font-black text-center border-0 bg-transparent text-emerald-500 ring-0 focus-visible:ring-0"
                            />
                            <span className="font-black text-emerald-500/30 uppercase text-xs tracking-[0.3em]">أيام</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
