

import { memo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/utils';

export const KPICard = memo(function KPICard({ title, value, unit, icon: Icon, subtitle, variant = 'default' }) {
    const variants = {
        primary: 'border-primary/20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent hover:from-primary/15 shadow-sm hover:shadow-primary/20',
        success: 'border-success/20 bg-gradient-to-br from-success/10 via-success/5 to-transparent hover:from-success/15 shadow-sm hover:shadow-success/20',
        warning: 'border-warning/20 bg-gradient-to-br from-warning/10 via-warning/5 to-transparent hover:from-warning/15 shadow-sm hover:shadow-warning/20',
        destructive: 'border-destructive/20 bg-gradient-to-br from-destructive/10 via-destructive/5 to-transparent hover:from-destructive/15 shadow-sm hover:shadow-destructive/20',
        secondary: 'border-secondary/20 bg-gradient-to-br from-secondary/10 via-secondary/5 to-transparent hover:from-secondary/15 shadow-sm hover:shadow-secondary/20',
        default: 'border-border bg-card hover:bg-muted/20 shadow-sm'
    };

    const iconColors = {
        primary: 'text-primary',
        success: 'text-success dark:text-success',
        warning: 'text-warning dark:text-warning',
        destructive: 'text-destructive dark:text-destructive',
        secondary: 'text-secondary',
        default: 'text-muted-foreground'
    };

    const iconBgColors = {
        primary: 'bg-primary/10',
        success: 'bg-success/10',
        warning: 'bg-warning/10',
        destructive: 'bg-destructive/10',
        secondary: 'bg-secondary/10',
        default: 'bg-muted/20'
    };

    return (
        <Card className={cn('border shadow-custom-md hover-lift hover:shadow-custom-xl transition-all duration-300 overflow-hidden relative group', variants[variant])}>
            <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-6 relative z-10">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-muted-foreground">{title}</p>
                    <div className={cn('p-2 rounded-lg transition-transform duration-300 group-hover:scale-110', iconBgColors[variant])}>
                        <Icon className={cn('w-5 h-5', iconColors[variant])} />
                    </div>
                </div>
                <div>
                    <p className="text-2xl md:text-3xl font-bold text-foreground group-hover:scale-105 transition-transform duration-300 inline-block">
                        {value}
                        <span className="text-lg">{unit}</span>
                    </p>
                    {subtitle && (
                        <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
                    )}
                </div>
            </CardContent>
        </Card>
    );
});

KPICard.displayName = 'KPICard';

