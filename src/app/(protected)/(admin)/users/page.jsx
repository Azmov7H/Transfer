'use client';

import { useState } from 'react';
import { PageHeader } from '@/components/ui/PageHeader';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader2, Plus, UserCog, Trash2, Shield } from 'lucide-react';
import { ExportButton } from '@/components/common/ExportButton';
import { useUserRole } from '@/hooks/useUserRole';
import { RoleGate } from '@/components/auth/RoleGate';
import { can, ROLES } from '@/lib/permissions';
import { cn } from '@/utils';
import { useUsers } from '@/hooks/useUsers';
import { UserFormDialog } from '@/components/users/UserFormDialog';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export default function UsersPage() {
    const { role, loading: isRoleLoading } = useUserRole();
    const canManage = can(role, 'users:manage');
    const canDelete = role === ROLES.OWNER;

    const { users, isLoading: isUsersLoading, createUser, updateUser, deleteUser } = useUsers();

    const isLoading = isRoleLoading || isUsersLoading;

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleOpenAdd = () => {
        setSelectedUser(null);
        setIsDialogOpen(true);
    };

    const handleOpenEdit = (user) => {
        setSelectedUser(user);
        setIsDialogOpen(true);
    };

    const handleSubmit = (formData) => {
        const payload = { ...formData };
        if (!payload.password) delete payload.password;

        if (selectedUser) {
            updateUser.mutate({ id: selectedUser._id, data: payload }, {
                onSuccess: () => setIsDialogOpen(false)
            });
        } else {
            createUser.mutate(payload, {
                onSuccess: () => setIsDialogOpen(false)
            });
        }
    };

    const [deleteTargetId, setDeleteTargetId] = useState(null);

    const handleDelete = (id) => {
        setDeleteTargetId(id);
    };

    const handleConfirmDelete = () => {
        if (deleteTargetId) {
            deleteUser.mutate(deleteTargetId);
        }
        setDeleteTargetId(null);
    };

    const getRoleBadge = (r) => {
        const configs = {
            owner: { variant: 'default', label: 'المالك', className: 'bg-info hover:bg-info' },
            manager: { variant: 'secondary', label: 'مدير' },
            warehouse: { variant: 'outline', label: 'مخزن', className: 'bg-warning/10 text-warning border-warning/30' },
            cashier: { variant: 'outline', label: 'كاشير' }
        };
        const config = configs[r] || configs.cashier;
        return <Badge variant={config.variant} className={cn(config.className)}>{config.label}</Badge>;
    };

    return (
        <RoleGate fallback={<UnauthorizedState />}>
            <div className="space-y-6 animate-fade-in-up">
            <PageHeader
                title="إدارة المستخدمين"
                subtitle="إضافة وتعديل صلاحيات المستخدمين"
                actions={
                    <>
                    <ExportButton
                        type="users"
                        data={users}
                        columns={[
                            { header: 'الاسم', key: 'name' },
                            { header: 'البريد', key: 'email' },
                            { header: 'الدور', key: 'role' }
                        ]}
                        pdfTitle="تقرير المستخدمين"
                    />
                    <Button onClick={handleOpenAdd} className="gap-2">
                        <Plus size={18} /> مستخدم جديد
                    </Button>
                    </>
                }
            />

            <div className="border rounded-lg glass-card shadow-custom-md overflow-hidden hover-lift transition-all duration-300">
                <Table aria-label="قائمة المستخدمين">
                    <TableHeader>
                        <TableRow>
                            <TableHead className="text-right">الاسم</TableHead>
                            <TableHead className="text-right">البريد الإلكتروني</TableHead>
                            <TableHead className="text-right">الصلاحية</TableHead>
                            <TableHead className="text-left">إجراءات</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-40 text-center">
                                    <Loader2 className="animate-spin mx-auto text-primary" />
                                </TableCell>
                            </TableRow>
                        ) : users.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} className="h-40 text-center text-muted-foreground">
                                    لا يوجد مستخدمين
                                </TableCell>
                            </TableRow>
                        ) : users.map(user => (
                            <TableRow key={user._id} className="transition-all duration-300 hover:bg-muted/50 group">
                                <TableCell className="font-semibold">{user.name}</TableCell>
                                <TableCell className="font-mono text-xs text-muted-foreground">{user.email}</TableCell>
                                <TableCell>{getRoleBadge(user.role)}</TableCell>
                                <TableCell>
                                    <div className="flex gap-2 justify-end opacity-10 md:opacity-0 group-hover:opacity-100 transition-all">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            aria-label="تعديل المستخدم"
                                            onClick={() => handleOpenEdit(user)}
                                            className="hover-scale hover:bg-primary/10 hover:text-primary"
                                        >
                                            <UserCog size={16} />
                                        </Button>
                                        {canDelete && user.role !== ROLES.OWNER && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                aria-label="حذف المستخدم"
                                                className="hover-scale text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(user._id)}
                                            >
                                                <Trash2 size={16} />
                                            </Button>
                                        )}
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <UserFormDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                user={selectedUser}
                onSubmit={handleSubmit}
                isPending={createUser.isPending || updateUser.isPending}
            />

            <ConfirmDialog
                open={deleteTargetId !== null}
                onOpenChange={(open) => !open && setDeleteTargetId(null)}
                title="حذف المستخدم"
                description="هل أنت متأكد من حذف هذا المستخدم؟ لا يمكن التراجع عن هذا الإجراء."
                confirmLabel="حذف"
                onConfirm={handleConfirmDelete}
            />
        </div>
        </RoleGate>
    );
}

function UnauthorizedState() {
    return (
        <div className="p-8 text-center animate-fade-in">
            <div className="inline-block p-4 bg-destructive/10 rounded-full mb-4">
                <Shield className="w-12 h-12 text-destructive" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">غير مصرح</h3>
            <p className="text-muted-foreground">ليس لديك صلاحية للوصول لهذه الصفحة</p>
        </div>
    );
}

