'use client';

import { useState } from 'react';
import {
    Card,
    CardHeader,
    CardContent,
    CardTitle,
    CardDescription,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { Link2, Loader2, Phone, FileDigit, Wallet, Fingerprint } from 'lucide-react';

function memberLabel(member) {
    const kind = member.kind === 'Customer' ? 'عميل' : 'مورد';
    return `${kind}: ${member.name}`;
}

function MemberRow({ member }) {
    return (
        <div className={`rounded-xl border p-4 space-y-3 ${member.linked ? 'border-primary/40 bg-primary/5' : 'border-border bg-card'}`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-3 min-w-0">
                    <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-lg">
                        <AvatarFallback className="bg-gradient-to-tr from-primary to-primary/60 text-white font-bold">
                            {(member.name || '؟').charAt(0)}
                        </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0">
                        <p className="font-bold text-sm truncate leading-tight">{member.name}</p>
                        <Badge variant={member.kind === 'Customer' ? 'outline' : 'secondary'} className="mt-1 font-bold h-5">
                            {member.kind === 'Customer' ? 'عميل' : 'مورد'}
                        </Badge>
                    </div>
                </div>
                {member.linked && (
                    <Badge className="bg-success/15 text-success border-success/30 font-bold">مرتبط بالفعل</Badge>
                )}
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
                {member.phone && (
                    <span className="flex items-center gap-1.5 font-mono"><Phone size={12} className="text-primary" /> {member.phone}</span>
                )}
                {member.taxNumber && (
                    <span className="flex items-center gap-1.5 font-mono"><FileDigit size={12} className="text-primary" /> {member.taxNumber}</span>
                )}
                <span className="flex items-center gap-1.5 font-bold">
                    <Wallet size={12} className="text-primary" /> الرصيد:
                    <span className={member.balance > 0 ? 'text-destructive' : 'text-success'}>{Number(member.balance ?? 0).toLocaleString()} ج.م</span>
                </span>
            </div>
        </div>
    );
}

function CandidateGroup({ group, onLink, isLinking }) {
    const members = group?.members || [];
    const first = members[0];
    const firstOpposite = members.find((m) => m.kind !== first?.kind);

    const [sourceId, setSourceId] = useState(first?.id || '');
    const [targetId, setTargetId] = useState(firstOpposite?.id || '');
    const [confirmOpen, setConfirmOpen] = useState(false);

    const sourceMember = members.find((m) => m.id === sourceId) || first;
    const sourceKind = sourceMember?.kind;
    const targetOptions = members.filter((m) => m.kind !== sourceKind);
    const canLink = Boolean(sourceKind && sourceId && targetId && sourceId !== targetId);

    const sourceLabel = sourceMember ? memberLabel(sourceMember) : '';
    const targetMember = members.find((m) => m.id === targetId);
    const targetLabel = targetMember ? memberLabel(targetMember) : '';

    // `group` carries no numeric confidence field; the matching basis is the
    // shared data point already grouped by (name / phone / taxNumber → `group.key`).
    const matchBasis = group?.key
        ? String(group.key).trim()
        : '';

    const handleSourceChange = (id) => {
        setSourceId(id);
        const nextSource = members.find((m) => m.id === id);
        setTargetId(members.find((m) => m.kind !== nextSource?.kind)?.id || '');
    };

    const handleConfirm = () => {
        if (!canLink) return;
        onLink({ sourceType: sourceKind, sourceId, targetId });
    };

    return (
        <Card>
            <CardHeader>
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <CardTitle className="text-lg flex items-center gap-2">
                        <Link2 className="h-5 w-5 text-primary" /> مطابقة محتملة على &quot;{group.key}&quot;
                    </CardTitle>
                    <div className="flex items-center gap-2">
                        {matchBasis && (
                            <Badge variant="secondary" className="font-bold gap-1 max-w-[16rem] truncate">
                                <Fingerprint className="h-3.5 w-3.5 shrink-0" />
                                <span className="truncate">أساس المطابقة: {matchBasis}</span>
                            </Badge>
                        )}
                        <Badge variant="outline" className="font-bold">{members.length} أطراف</Badge>
                    </div>
                </div>
                <CardDescription>بيانات متطابقة بين الأطراف — راجع يدويًا ثم اربط الطرفين لدمج أرصدتهما</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid gap-3 md:grid-cols-2">
                    {members.map((member) => (
                        <MemberRow key={member.id} member={member} />
                    ))}
                </div>

                <Separator />

                <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto] items-end">
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">الطرف المصدر</Label>
                        <Select value={sourceId} onValueChange={handleSourceChange}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {members.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>{memberLabel(m)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-2">
                        <Label className="text-xs font-bold">الطرف الهدف</Label>
                        <Select value={targetId} onValueChange={setTargetId}>
                            <SelectTrigger>
                                <SelectValue placeholder={targetOptions.length ? 'اختر الطرف المقابل...' : 'لا يوجد طرف مقابل للربط'} />
                            </SelectTrigger>
                            <SelectContent>
                                {targetOptions.map((m) => (
                                    <SelectItem key={m.id} value={m.id}>{memberLabel(m)}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <Button
                        onClick={() => setConfirmOpen(true)}
                        disabled={!canLink || isLinking}
                        className="gap-2 rounded-xl font-bold"
                    >
                        {isLinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link2 className="h-4 w-4" />}
                        تأكيد الربط
                    </Button>
                </div>
            </CardContent>
            <ConfirmDialog
                open={confirmOpen}
                onOpenChange={setConfirmOpen}
                title="تأكيد ربط الطرفين"
                description={`سيتم دمج رصيد الطرفين: ${sourceLabel} و ${targetLabel}. هذا الإجراء يؤكد أن الطرفين هما نفس الكيان.`}
                confirmLabel="تأكيد الربط"
                pending={isLinking}
                onConfirm={handleConfirm}
            />
        </Card>
    );
}

export function DuplicateCandidates({ candidates = [], onLink, isLinking }) {
    if (!candidates.length) return null;
    return (
        <div className="space-y-6" dir="rtl">
            {candidates.map((group) => (
                <CandidateGroup key={group.key} group={group} onLink={onLink} isLinking={isLinking} />
            ))}
        </div>
    );
}