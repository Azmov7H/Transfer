'use client';

import { useParties } from '@/hooks/useParties';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link2, RefreshCcw, ShieldCheck } from 'lucide-react';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';
import { EmptyState } from '@/components/common/EmptyState';
import { DuplicateCandidates } from '@/components/parties/DuplicateCandidates';

export default function PartiesPage() {
    const { data, isLoading, isError, error, refetch, linkMutation } = useParties();

    const candidates = data?.candidates || [];
    const total = data?.total ?? candidates.length;

    const handleLink = (payload) => {
        linkMutation.mutate(payload);
    };

    return (
        <div className="min-h-screen bg-foreground/1020 space-y-8 p-4 md:p-8 rounded-[2rem]" dir="rtl">
            <PageHeader
                title="الأطراف / التحقق من التكرار"
                subtitle="اكتشاف ودمج حسابات العملاء والموردين المكررة"
                icon={Link2}
                actions={
                    <>
                        <div className="hidden xl:flex items-center gap-6 glass-card px-8 py-4 rounded-3xl border border-white/10 shadow-xl ml-4">
                            <div className="flex flex-col items-end">
                                <span className="text-xs font-bold text-muted-foreground uppercase tracking-[0.2em]">مجموعات التكرار المحتملة</span>
                                <span className="text-xl font-bold tabular-nums">{total.toLocaleString()}</span>
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="icon"
                            aria-label="إعادة فحص الأطراف"
                            className="w-14 h-14 rounded-2xl glass-card border-white/10 hover:border-primary/50 transition-all shadow-lg"
                            onClick={() => refetch()}
                            disabled={isLoading}
                        >
                            <RefreshCcw className="w-6 h-6 text-muted-foreground" />
                        </Button>
                    </>
                }
            />

            {isLoading ? (
                <div className="glass-card shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/10 rounded-[2.5rem] overflow-hidden">
                    <LoadingState message="جاري فحص الأطراف وتحديد المكرر..." size="lg" className="py-24" />
                </div>
            ) : isError ? (
                <div className="glass-card shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/10 rounded-[2.5rem] overflow-hidden">
                    <ErrorState
                        title="تعذر فحص الأطراف"
                        message={error?.message || 'هذه الصفحة متاحة للمالك والمدير فقط، أو حدث خطأ في الخادم.'}
                        onRetry={() => refetch()}
                    />
                </div>
            ) : candidates.length === 0 ? (
                <div className="glass-card shadow-[0_40px_80px_rgba(0,0,0,0.3)] border border-white/10 rounded-[2.5rem] overflow-hidden">
                    <EmptyState
                        icon={ShieldCheck}
                        title="لا توجد أطراف مكررة"
                        hint="تم فحص العملاء والموردين ولم يتم العثور على تطابقات محتملة"
                    />
                </div>
            ) : (
                <>
                    <div className="flex items-center gap-3 px-2">
                        <div className="w-2 h-6 bg-primary rounded-full" />
                        <h2 className="text-2xl font-bold tracking-tight">المجموعات المرشحة للدمج</h2>
                        <Badge variant="outline" className="px-4 py-1.5 rounded-full border-primary/20 bg-primary/5 text-primary font-bold">
                            {total} مجموعة
                        </Badge>
                    </div>
                    <DuplicateCandidates
                        candidates={candidates}
                        onLink={handleLink}
                        isLinking={linkMutation.isPending}
                    />
                </>
            )}
        </div>
    );
}