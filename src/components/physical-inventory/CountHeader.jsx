'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
    Loader2,
    ArrowRight,
    Save,
    CheckCircle,
    Activity,
    Lock,
    Unlock
} from 'lucide-react';
import { format } from 'date-fns';
import { ar } from 'date-fns/locale';
import { cn } from '@/utils';

export function CountHeader({ count, isCompleted, isBlind, localItems, hasUnsavedChanges, updateMutation, completeMutation, unlockMutation, unlockPassword, setUnlockPassword, isUnlockDialogOpen, setIsUnlockDialogOpen }) {
    return (
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-3">
                    <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shadow-lg shadow-primary/5 rotate-3">
                        <Activity className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                            جرد: {count.location === 'warehouse' ? 'المخزن الرئيسي' : count.location === 'shop' ? 'المحل' : 'شامل'}
                            <Badge className={cn(
                                "px-4 py-1 rounded-full font-bold text-xs",
                                isCompleted ? "bg-success text-white shadow-success/20" : "bg-warning text-white shadow-warning/20"
                            )}>
                                {isCompleted ? 'مكتمل ومعتمد' : 'مسودة قيد العمل'}
                            </Badge>
                            {count.category && (
                                <Badge variant="outline" className="px-4 py-1 rounded-full border-primary/30 text-primary font-bold">
                                    قسم: {count.category}
                                </Badge>
                            )}
                        </h1>
                        <p className="text-sm text-muted-foreground font-medium mt-1">
                            {format(new Date(count.date), 'EEEE, dd MMMM yyyy - hh:mm a', { locale: ar })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex gap-3 w-full lg:w-auto">
                {isCompleted && (
                    <AlertDialog open={isUnlockDialogOpen} onOpenChange={setIsUnlockDialogOpen}>
                        <AlertDialogTrigger asChild>
                            <Button
                                variant="outline"
                                size="lg"
                                className="h-14 px-8 rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/40 font-bold"
                            >
                                <Unlock className="ml-2 h-4 w-4" />
                                تعديل الجرد (كلمة سر المالك)
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] border-0 glass-card">
                            <AlertDialogHeader className="pb-4">
                                <AlertDialogTitle className="text-2xl font-bold flex items-center gap-2">
                                    <Lock className="w-6 h-6 text-destructive" />
                                    يتطلب صلاحية المالك
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-base font-medium">
                                    هذا الجرد معتمد ومكتمل. لتعديله، يجب إدخال كلمة مرور المالك لتحويله إلى وضع &quot;المسودة&quot;.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <div className="py-4">
                                <Label className="font-bold mb-2 block text-right">كلمة مرور المالك</Label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={unlockPassword}
                                    onChange={(e) => setUnlockPassword(e.target.value)}
                                    className="h-12 rounded-xl border-muted bg-muted/20 text-center"
                                    onKeyDown={(e) => e.key === 'Enter' && unlockMutation.mutate(unlockPassword)}
                                    autoComplete="new-password"
                                />
                            </div>
                            <AlertDialogFooter className="gap-3">
                                <AlertDialogCancel className="h-12 rounded-xl font-bold border-0 bg-muted">إلغاء</AlertDialogCancel>
                                <Button
                                    onClick={() => unlockMutation.mutate(unlockPassword)}
                                    disabled={unlockMutation.isPending || !unlockPassword}
                                    className="h-12 rounded-xl font-bold bg-destructive hover:bg-destructive text-white shadow-lg shadow-rose-600/20"
                                >
                                    {unlockMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin ml-2" /> : "تأكيد الهوية"}
                                </Button>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                )}

                {!isCompleted && (
                    <div className="flex gap-3 w-full lg:w-auto">
                        <Button
                            variant="outline"
                            size="lg"
                            onClick={() => {
                                updateMutation.mutate({
                                    items: localItems.map(item => ({
                                        productId: item.productId?._id || item.productId,
                                        actualQty: item.actualQty,
                                        reason: item.reason,
                                        justification: item.justification
                                    }))
                                });
                            }}
                            disabled={!hasUnsavedChanges || updateMutation.isPending}
                            className="h-14 px-8 rounded-2xl border-primary/20 hover:border-primary/40 hover:bg-primary/5 font-bold flex-1 lg:flex-none"
                        >
                            {updateMutation.isPending ? <Loader2 className="ml-2 h-4 w-4 animate-spin" /> : <Save className="ml-2 h-4 w-4" />}
                            حفظ المسودة
                        </Button>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    size="lg"
                                    disabled={hasUnsavedChanges || completeMutation.isPending}
                                    className="h-14 px-10 rounded-2xl gradient-primary border-0 shadow-lg shadow-primary/20 font-bold flex-1 lg:flex-none"
                                >
                                    <CheckCircle className="ml-2 h-4 w-4" />
                                    اعتماد الجرد نهائياً
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="rounded-[2.5rem] border-0 glass-card">
                                <AlertDialogHeader className="pb-4">
                                    <AlertDialogTitle className="text-2xl font-bold">هل أنت متأكد من الاعتماد؟</AlertDialogTitle>
                                    <AlertDialogDescription asChild>
                                        <div className="text-base font-medium text-right">
                                            عند الضغط على &quot;تأكيد&quot;، سيقوم النظام بـ:
                                            <ul className="list-disc pr-6 mt-4 space-y-2 text-destructive font-bold">
                                                <li>تعديل كميات الأصناف فعلياً في المخزن المختار.</li>
                                                <li>تسجيل قيود محاسبية بالفوارق المالية المكتشفة.</li>
                                                <li>أرشفة هذه الجلسة ولا يمكن التعديل عليها بعدها.</li>
                                            </ul>
                                        </div>
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="gap-3">
                                    <AlertDialogCancel className="h-12 rounded-xl font-bold border-0 bg-muted">إلغاء</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => completeMutation.mutate()}
                                        className="h-12 rounded-xl font-bold bg-destructive hover:bg-destructive text-white shadow-lg shadow-rose-600/20"
                                    >
                                        تأكيد واعتماد الكميات
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </div>
                )}
            </div>
        </div>
    );
}
