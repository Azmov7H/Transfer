'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
    Loader2,
    ArrowRight,
    AlertTriangle,
    Search,
    Trash2,
    Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { use } from 'react';
import {
    useInventoryCount,
    useUpdateInventoryCount,
    useCompleteInventoryCount,
    useUnlockInventoryCount,
    useDeleteInventoryCount,
    useCountRecentMovements
} from '@/hooks/usePhysicalInventory';
import { CountHeader } from '@/components/physical-inventory/CountHeader';
import { CountStatsDashboard } from '@/components/physical-inventory/CountStatsDashboard';
import { ScannerBar } from '@/components/physical-inventory/ScannerBar';
import { CountItemsTable } from '@/components/physical-inventory/CountItemsTable';
import { UnsavedChangesToast } from '@/components/physical-inventory/UnsavedChangesToast';

export default function PhysicalInventoryDetailPage({ params }) {
    const router = useRouter();
    const { id } = use(params);
    const [search, setSearch] = useState('');
    const [barcode, setBarcode] = useState('');
    const [localItems, setLocalItems] = useState([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isScannerFocused, setIsScannerFocused] = useState(false);
    const [lastScanned, setLastScanned] = useState(null);
    const [unlockPassword, setUnlockPassword] = useState('');
    const [isUnlockDialogOpen, setIsUnlockDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const scannerInputRef = useRef(null);

    const { data: count, isLoading, error, refetch } = useInventoryCount(id);
    const { data: movementsSinceSnapshot } = useCountRecentMovements(id);
    const updateMutation = useUpdateInventoryCount(id);
    const completeMutation = useCompleteInventoryCount(id);
    const unlockMutation = useUnlockInventoryCount(id);
    const deleteMutation = useDeleteInventoryCount();

    // Initialize local state when data loads
    useEffect(() => {
        if (count) {
            setLocalItems(count.items);
            setHasUnsavedChanges(false);
        }
    }, [count]);

    // Handle quantity change
    const handleQuantityChange = (productId, newQty, justificationData = null) => {
        const qty = parseFloat(newQty) || 0;
        setLocalItems(prev => prev.map(item => {
            // Check both standard _id and potentially populated _id
            const itemProdId = item.productId?._id || item.productId;
            if (itemProdId === productId) {
                const diff = qty - item.systemQty;
                return {
                    ...item,
                    actualQty: qty,
                    difference: diff,
                    value: diff * (item.buyPrice || 0),
                    ...justificationData
                };
            }
            return item;
        }));
        setHasUnsavedChanges(true);
    };

    // Handle Barcode Scan
    const handleBarcodeSubmit = (e) => {
        e.preventDefault();
        if (!barcode.trim()) return;

        const targetItem = localItems.find(item =>
            item.productCode === barcode.trim() ||
            item.productName.includes(barcode.trim())
        );

        if (targetItem) {
            const prodId = targetItem.productId?._id || targetItem.productId;
            handleQuantityChange(prodId, targetItem.actualQty + 1);
            setLastScanned({
                name: targetItem.productName,
                time: new Date()
            });
            setBarcode('');
            toast.success(`تمت إضافة: ${targetItem.productName}`, {
                icon: <Zap className="w-4 h-4 text-success" />,
                duration: 1500
            });
        } else {
            toast.error('المنتج غير موجود في قائمة الجرد الحالية');
            setBarcode('');
        }
    };

    // Filter items based on search
    const filteredItems = useMemo(() => {
        if (!search) return localItems;
        return localItems.filter(item =>
            item.productName.toLowerCase().includes(search.toLowerCase()) ||
            item.productCode.toLowerCase().includes(search.toLowerCase())
        );
    }, [localItems, search]);

    // Calculate live discrepancies
    const discrepancies = useMemo(() => {
        const diffs = localItems.filter(i => i.difference !== 0);
        const shortage = diffs.filter(i => i.difference < 0).reduce((sum, i) => sum + Math.abs(i.difference), 0);
        const surplus = diffs.filter(i => i.difference > 0).reduce((sum, i) => sum + i.difference, 0);
        const valueImpact = diffs.reduce((sum, i) => sum + i.value, 0);

        return { count: diffs.length, shortage, surplus, valueImpact };
    }, [localItems]);

    if (isLoading) return (
        <div className="flex flex-col items-center justify-center p-40 gap-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="font-bold text-muted-foreground animate-pulse">جاري تحميل بيانات الجرد...</p>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center p-40 gap-4 text-destructive">
            <AlertTriangle className="h-16 w-16" />
            <p className="text-xl font-bold">خطأ في التحميل: {error.message}</p>
            <Button onClick={() => refetch()} variant="outline">إعادة المحاولة</Button>
        </div>
    );

    // The endpoint can return null when the id is missing/invalid. Guard
    // before accessing fields to avoid `can't access property "status",
    // count is null`.
    if (!count) return (
        <div className="flex flex-col items-center justify-center p-40 gap-4">
            <AlertTriangle className="h-16 w-16 text-muted-foreground" />
            <p className="text-xl font-bold text-muted-foreground">جلسة الجرد غير موجودة أو تم حذفها</p>
            <Button onClick={() => router.push('/physical-inventory')} variant="outline">العودة للمركز الرئيسي</Button>
        </div>
    );

    const isCompleted = count.status === 'completed';
    const isBlind = count.isBlind && !isCompleted;

    const handleSaveDraft = () => {
        updateMutation.mutate({
            items: localItems.map(item => ({
                productId: item.productId?._id || item.productId,
                actualQty: item.actualQty,
                reason: item.reason,
                justification: item.justification
            }))
        });
    };

    return (
        <div className="container max-w-7xl mx-auto space-y-8 pb-20 px-4 text-right" dir="rtl">
            {/* Action Bar & Quick Info */}
            <div className="flex items-center justify-between gap-2">
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-fit mb-2 hover:bg-primary/5 text-muted-foreground group"
                    onClick={() => router.push('/physical-inventory')}
                >
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    العودة للمركز الرئيسي
                </Button>
                {!isCompleted && (
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-fit mb-2 text-destructive hover:bg-destructive/10 hover:text-destructive font-bold"
                        onClick={() => setIsDeleteDialogOpen(true)}
                    >
                        <Trash2 className="ml-2 h-4 w-4" />
                        حذف المسودة
                    </Button>
                )}
            </div>
            <ConfirmDialog
                open={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                title="حذف مسودة الجرد"
                description="سيتم حذف جلسة الجرد هذه نهائياً ولا يمكن التراجع. المتابعة؟"
                confirmLabel="حذف نهائي"
                pending={deleteMutation.isPending}
                onConfirm={() => deleteMutation.mutate(id, {
                    onSuccess: () => router.push('/physical-inventory')
                })}
            />

            <CountHeader
                count={count}
                isCompleted={isCompleted}
                isBlind={isBlind}
                localItems={localItems}
                hasUnsavedChanges={hasUnsavedChanges}
                updateMutation={updateMutation}
                completeMutation={completeMutation}
                unlockMutation={unlockMutation}
                unlockPassword={unlockPassword}
                setUnlockPassword={setUnlockPassword}
                isUnlockDialogOpen={isUnlockDialogOpen}
                setIsUnlockDialogOpen={setIsUnlockDialogOpen}
            />

            {/* Smart Stats Dashboard */}
            <CountStatsDashboard localItems={localItems} discrepancies={discrepancies} isBlind={isBlind} />

            {/* Scanner Mode Control Bar */}
            <ScannerBar
                isCompleted={isCompleted}
                isScannerFocused={isScannerFocused}
                barcode={barcode}
                setBarcode={setBarcode}
                setIsScannerFocused={setIsScannerFocused}
                onSubmit={handleBarcodeSubmit}
                lastScanned={lastScanned}
                scannerInputRef={scannerInputRef}
            />

            {/* Inventory Table & Listing */}
            <CountItemsTable
                search={search}
                setSearch={setSearch}
                filteredItems={filteredItems}
                isBlind={isBlind}
                isCompleted={isCompleted}
                movementsSinceSnapshot={movementsSinceSnapshot}
                onQuantityChange={handleQuantityChange}
            />

            {/* Float Saved Status (Bottom) */}
            <UnsavedChangesToast
                show={hasUnsavedChanges && !isCompleted}
                isPending={updateMutation.isPending}
                onSave={handleSaveDraft}
            />
        </div>
    );
}
