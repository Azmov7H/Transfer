import Link from 'next/link';
import { FileQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 p-8">
            <div className="flex flex-col items-center gap-2 text-center">
                <div className="rounded-full bg-muted p-4 text-muted-foreground">
                    <FileQuestion size={48} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight">الصفحة غير موجودة</h2>
                <p className="text-muted-foreground">
                    الصفحة التي تبحث عنها غير متاحة أو تم نقلها.
                </p>
            </div>
            <Button asChild variant="default">
                <Link href="/">العودة للرئيسية</Link>
            </Button>
        </div>
    );
}
