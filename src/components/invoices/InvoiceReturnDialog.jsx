'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/utils';
import {
    ArrowRightLeft, ArrowRight, Package, Banknote, Wallet, Loader2
} from 'lucide-react';

export function InvoiceReturnDialog({ invoice, open, onOpenChange, returnItems, setReturnItems, refundMethod, setRefundMethod, onSubmit, isReturning }) {
    return (
                    <Dialog open={open} onOpenChange={onOpenChange}>
                        <DialogTrigger asChild>
                            <Button variant="secondary" className="gap-2 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-200 shadow-sm hover-lift">
                                <ArrowRightLeft size={16} /> استرجاع منتجات
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-5xl bg-slate-950/90 backdrop-blur-2xl border-white/5 shadow-[0_32px_64px_rgba(0,0,0,0.5)] p-0 gap-0 overflow-hidden rounded-[2.5rem]" dir="rtl">
                            <div className="absolute top-0 right-0 w-full h-1.5 bg-gradient-to-l from-amber-500 via-amber-400 to-amber-500 opacity-80" />

                            <div className="p-8 pb-4">
                                <DialogHeader>
                                    <div className="flex items-center justify-between">
                                        <DialogTitle className="text-2xl font-black flex items-center gap-4 text-white">
                                            <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 shadow-inner">
                                                <ArrowRightLeft className="text-amber-500" size={24} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span>استرجاع منتجات معتمدة</span>
                                                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-0.5">الفاتورة #{invoice.number}</span>
                                            </div>
                                        </DialogTitle>
                                        <div className="text-left hidden md:block">
                                            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block mb-1">تاريخ الفاتورة</span>
                                            <span className="text-xs font-bold text-slate-300 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                                                {format(new Date(invoice.date), 'd MMMM yyyy', { locale: ar })}
                                            </span>
                                        </div>
                                    </div>
                                </DialogHeader>
                            </div>

                            <div className="flex-1 overflow-hidden flex flex-col">
                                <ScrollArea className="flex-1 max-h-[320px] px-8 py-2">
                                    <div className="space-y-4 pb-8">
                                        {invoice.items.map((item, i) => {
                                            const itemId = item._id; // Use unique invoice item ID
                                            const currentReturnQty = returnItems[itemId] || 0;
                                            const isSelected = currentReturnQty > 0;

                                            return (
                                                <motion.div
                                                    key={i}
                                                    initial={false}
                                                    animate={{
                                                        scale: isSelected ? 1.01 : 1,
                                                        borderColor: isSelected ? 'rgba(245, 158, 11, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                                                        backgroundColor: isSelected ? 'rgba(245, 158, 11, 0.03)' : 'rgba(255, 255, 255, 0.02)'
                                                    }}
                                                    className={cn(
                                                        "group border rounded-3xl p-5 transition-all duration-300 relative overflow-hidden",
                                                    )}
                                                >
                                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
                                                        <div className="flex items-center gap-4 flex-1">
                                                            <div className={cn(
                                                                "h-12 w-12 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                                isSelected ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20" : "bg-white/5 text-slate-500"
                                                            )}>
                                                                <Package size={20} />
                                                            </div>
                                                            <div className="flex flex-col">
                                                                <h4 className="font-black text-white text-lg group-hover:text-amber-400 transition-colors uppercase tracking-tight">
                                                                    {item.productName || item.name || 'منتج'}
                                                                </h4>
                                                                <div className="flex items-center gap-3 text-xs font-bold mt-1">
                                                                    <span className="text-slate-500">سعر الوحدة:</span>
                                                                    <span className="text-slate-300">{item.unitPrice.toLocaleString()} ج.م</span>
                                                                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                                                                    <span className="text-slate-500">المباع:</span>
                                                                    <Badge variant="outline" className="h-5 px-2 bg-white/5 border-white/10 text-slate-300">{item.qty}</Badge>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col items-center md:items-end gap-3">
                                                            <div className="flex items-center bg-black/40 p-1.5 rounded-2xl border border-white/5 shadow-inner backdrop-blur-md">
                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
                                                                    onClick={() => {
                                                                        if (currentReturnQty > 0) {
                                                                            setReturnItems(prev => ({ ...prev, [itemId]: currentReturnQty - 1 }));
                                                                        }
                                                                    }}
                                                                >
                                                                    <span className="text-2xl font-black leading-none">-</span>
                                                                </Button>

                                                                <div className="w-14 text-center">
                                                                    <span className={cn(
                                                                        "text-2xl font-black tracking-tighter transition-all duration-300",
                                                                        isSelected ? "text-amber-500 scale-110" : "text-slate-600"
                                                                    )}>
                                                                        {currentReturnQty}
                                                                    </span>
                                                                </div>

                                                                <Button
                                                                    variant="ghost"
                                                                    size="icon"
                                                                    className="h-10 w-10 rounded-xl hover:bg-white/10 text-slate-400 hover:text-white transition-all active:scale-95"
                                                                    onClick={() => {
                                                                        if (currentReturnQty < item.qty) {
                                                                            setReturnItems(prev => ({ ...prev, [itemId]: currentReturnQty + 1 }));
                                                                        }
                                                                    }}
                                                                >
                                                                    <span className="text-xl font-black leading-none">+</span>
                                                                </Button>
                                                            </div>
                                                            {isSelected && (
                                                                <motion.div
                                                                    initial={{ opacity: 0, scale: 0.9 }}
                                                                    animate={{ opacity: 1, scale: 1 }}
                                                                    className="text-[10px] font-black text-amber-500/60 uppercase tracking-widest"
                                                                >
                                                                    سيتم استرداد {(currentReturnQty * item.unitPrice).toLocaleString()} ج.م
                                                                </motion.div>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {/* Background Accent for Selected */}
                                                    {isSelected && (
                                                        <motion.div
                                                            layoutId={`accent-${i}`}
                                                            className="absolute inset-0 bg-gradient-to-r from-amber-500/5 to-transparent pointer-events-none"
                                                        />
                                                    )}
                                                </motion.div>
                                            )
                                        })}
                                    </div>
                                </ScrollArea>
                            </div>

                            <div className="p-8 pt-6 bg-slate-900/50 border-t border-white/5">
                                <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                                    <div className="md:col-span-5 space-y-4">
                                        <div className="space-y-3">
                                            <Label className="text-[10px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-2 mr-1">
                                                <Wallet size={12} className="text-amber-500" /> طريقة رد المبلغ
                                            </Label>
                                            <div className="grid grid-cols-2 gap-2">
                                                <button
                                                    onClick={() => setRefundMethod('cash')}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group/btn",
                                                        refundMethod === 'cash'
                                                            ? "bg-amber-500/10 border-amber-500/50 text-amber-500"
                                                            : "bg-white/20 border-transparent text-slate-400 hover:bg-white/5 hover:border-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "p-2 rounded-xl transition-all",
                                                        refundMethod === 'cash' ? "bg-amber-500 text-white" : "bg-white/5 group-hover/btn:bg-white/10"
                                                    )}>
                                                        <Banknote size={16} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">خزينة نقداً</span>
                                                </button>
                                                <button
                                                    onClick={() => setRefundMethod('customerBalance')}
                                                    className={cn(
                                                        "flex flex-col items-center gap-2 p-3 rounded-2xl border-2 transition-all group/btn",
                                                        refundMethod === 'customerBalance'
                                                            ? "bg-blue-500/10 border-blue-500/50 text-blue-500"
                                                            : "bg-white/20 border-transparent text-slate-400 hover:bg-white/5 hover:border-white/10"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "p-2 rounded-xl transition-all",
                                                        refundMethod === 'customerBalance' ? "bg-blue-500 text-white" : "bg-white/5 group-hover/btn:bg-white/10"
                                                    )}>
                                                        <Wallet size={16} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-tighter">محفظة العميل</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="md:col-span-7 flex flex-col justify-end">
                                        <div className="bg-slate-950/80 rounded-3xl p-6 border border-white/5 shadow-inner relative overflow-hidden group">
                                            <div className="flex justify-between items-center relative z-10">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">صافي القيمة المستردة</span>
                                                    <div className="flex items-baseline gap-2">
                                                        <span className="text-4xl font-black text-amber-400 tracking-tighter">
                                                            {
                                                                invoice.items.reduce((sum, item) => {
                                                                    const qty = returnItems[item.productId?._id || item.productId] || 0;
                                                                    return sum + (qty * item.unitPrice);
                                                                }, 0).toLocaleString()
                                                            }
                                                        </span>
                                                        <span className="text-sm font-black text-slate-500">ج.م</span>
                                                    </div>
                                                </div>
                                                <Button
                                                    onClick={onSubmit}
                                                    disabled={isReturning || Object.values(returnItems).every(q => q === 0)}
                                                    className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-white font-black shadow-lg shadow-primary/20 hover:scale-105 active:scale-95 transition-all gap-2 disabled:opacity-50 disabled:scale-100"
                                                >
                                                    {isReturning ? <Loader2 className="animate-spin" /> : (
                                                        <>
                                                            <span>اعتماد المرتجع</span>
                                                            <ArrowRight className="w-5 h-5 rotate-180" />
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>
    );
}
