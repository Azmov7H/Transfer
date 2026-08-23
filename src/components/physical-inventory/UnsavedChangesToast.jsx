'use client';

import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';
import { Loader2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export function UnsavedChangesToast({ show, isPending, onSave }) {
    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 100 }}
                    className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 overflow-hidden"
                >
                    <div className="bg-amber-600 px-8 py-4 rounded-[2rem] shadow-2xl flex items-center gap-4 border border-amber-500/50">
                        <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                            <AlertTriangle className="w-5 h-5 text-white animate-bounce" />
                        </div>
                        <div className="text-white text-right">
                            <h4 className="font-black text-sm leading-none">تنبيه: يوجد تغييرات غير محفوظة</h4>
                            <p className="text-[10px] font-bold opacity-80 mt-1">تأكد من الحفظ قبل الخروج</p>
                        </div>
                        <Button
                            size="sm"
                            variant="secondary"
                            className="h-10 rounded-xl px-4 font-black bg-white text-amber-600 hover:bg-white/90"
                            onClick={onSave}
                            disabled={isPending}
                        >
                            {isPending ? <Loader2 className="animate-spin h-4 w-4" /> : "حفظ الآن"}
                        </Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
