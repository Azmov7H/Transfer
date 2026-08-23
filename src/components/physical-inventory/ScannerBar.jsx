'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search, ScanBarcode, History } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/utils';

export function ScannerBar({ isCompleted, isScannerFocused, barcode, setBarcode, setIsScannerFocused, onSubmit, lastScanned, scannerInputRef }) {
    return (
        <AnimatePresence>
            {!isCompleted && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <Card className={cn(
                        "glass-card border-2 transition-all duration-500 overflow-hidden rounded-[2.5rem]",
                        isScannerFocused ? "border-primary/50 shadow-2xl scale-[1.01]" : "border-transparent shadow-custom-xl"
                    )}>
                        <CardContent className="p-6">
                            <form onSubmit={onSubmit} className="flex flex-col md:flex-row items-center gap-6">
                                <div className="flex-1 w-full space-y-2">
                                    <Label className="text-sm font-black flex items-center gap-2 mr-2">
                                        <ScanBarcode className="w-5 h-5 text-primary rotate-12" /> وضع الماسح السريع (Scanner Mode)
                                    </Label>
                                    <div className="relative">
                                        <Input
                                            ref={scannerInputRef}
                                            placeholder="امسح الباركود هنا للإضافة التلقائية..."
                                            value={barcode}
                                            onChange={(e) => setBarcode(e.target.value)}
                                            onFocus={() => setIsScannerFocused(true)}
                                            onBlur={() => setIsScannerFocused(false)}
                                            className="h-16 rounded-2xl bg-muted/40 border-0 text-xl font-bold pr-14 focus:ring-4 ring-primary/20 transition-all text-center"
                                            autoComplete="off"
                                        />
                                        <Search className="absolute right-5 top-5 h-6 w-6 text-muted-foreground/40" />
                                    </div>
                                </div>

                                {lastScanned && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 min-w-64"
                                    >
                                        <div className="h-10 w-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                                            <History className="w-5 h-5 text-emerald-600" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-emerald-700/60 uppercase tracking-widest leading-none mb-1">Last Scanned</p>
                                            <h4 className="text-sm font-bold truncate max-w-44 leading-none">{lastScanned.name}</h4>
                                        </div>
                                    </motion.div>
                                )}
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
