'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Users,
    Phone,
    Mail,
    Globe,
    MapPin,
    Plus,
    Trash2,
    Building2
} from 'lucide-react';
import { TabHeader } from './TabHeader';

export function GeneralSettingsTab({ settings, onChange }) {
    const set = (patch) => onChange({ ...settings, ...patch });

    return (
        <div className="glass-card shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/10 rounded-[3rem] overflow-hidden animate-in slide-in-from-bottom-8 duration-700">
            <div className="p-12">
                <TabHeader
                    icon={Building2}
                    title="بيانات المؤسسة"
                    description="تظهر هذه البيانات في ترويسة الفاتورة والتقارير الرسمية"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
                    <div className="space-y-3">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            <Users size={14} className="text-primary" /> اسم المؤسسة
                        </Label>
                        <Input
                            value={settings.companyName || ''}
                            onChange={e => set({ companyName: e.target.value })}
                            className="h-11 bg-muted/30 border-muted-foreground/10 focus:border-primary/30 transition-all rounded-xl shadow-sm"
                            placeholder="اسم شركتك أو مخزنك"
                        />
                    </div>
                    <div className="space-y-3 md:col-span-1">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            <Phone size={14} className="text-primary" /> أرقام الهاتف
                        </Label>
                        <div className="space-y-2">
                            {/* Primary Phone */}
                            <div className="relative">
                                <Input
                                    value={settings.phone || ''}
                                    onChange={e => set({ phone: e.target.value })}
                                    className="h-11 bg-muted/30 border-muted-foreground/10 focus:border-primary/30 transition-all rounded-xl shadow-sm pl-20"
                                    placeholder="رقم الهاتف الأساسي"
                                />
                                <span className="absolute left-3 top-3 text-xs font-bold text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">أساسي</span>
                            </div>

                            {/* Additional Phones */}
                            {settings.additionalPhones?.map((phone, idx) => (
                                <div key={idx} className="flex gap-2 animate-in slide-in-from-top-2 duration-300">
                                    <Input
                                        value={phone}
                                        onChange={e => {
                                            const newPhones = [...(settings.additionalPhones || [])];
                                            newPhones[idx] = e.target.value;
                                            set({ additionalPhones: newPhones });
                                        }}
                                        className="h-11 bg-muted/30 border-muted-foreground/10 focus:border-primary/30 transition-all rounded-xl shadow-sm"
                                        placeholder="رقم إضافي..."
                                    />
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => {
                                            const newPhones = settings.additionalPhones.filter((_, i) => i !== idx);
                                            set({ additionalPhones: newPhones });
                                        }}
                                        className="h-11 w-11 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700"
                                    >
                                        <Trash2 size={18} />
                                    </Button>
                                </div>
                            ))}

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => set({
                                    additionalPhones: [...(settings.additionalPhones || []), '']
                                })}
                                className="w-full h-10 border-dashed border-primary/30 text-primary hover:bg-primary/5 rounded-xl gap-2"
                            >
                                <Plus size={16} /> إضافة رقم آخر
                            </Button>
                        </div>
                    </div>
                    <div className="space-y-3">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            <Mail size={14} className="text-primary" /> البريد الإلكتروني
                        </Label>
                        <Input
                            value={settings.email || ''}
                            onChange={e => set({ email: e.target.value })}
                            className="h-11 bg-muted/30 border-muted-foreground/10 focus:border-primary/30 transition-all rounded-xl shadow-sm"
                            placeholder="info@example.com"
                        />
                    </div>
                    <div className="space-y-3">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            <Globe size={14} className="text-primary" /> الموقع الإلكتروني
                        </Label>
                        <Input
                            value={settings.website || ''}
                            onChange={e => set({ website: e.target.value })}
                            className="h-11 bg-muted/30 border-muted-foreground/10 focus:border-primary/30 transition-all rounded-xl shadow-sm"
                            placeholder="www.example.com"
                        />
                    </div>
                    <div className="space-y-3 md:col-span-2">
                        <Label className="text-sm font-bold flex items-center gap-2">
                            <MapPin size={14} className="text-primary" /> العنوان بالكامل
                        </Label>
                        <Input
                            value={settings.address || ''}
                            onChange={e => set({ address: e.target.value })}
                            className="h-11 bg-muted/30 border-muted-foreground/10 focus:border-primary/30 transition-all rounded-xl shadow-sm"
                            placeholder="القاهرة، مدينة نصر، شارع..."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
