'use client';

import Link from 'next/link';
import { cn } from '@/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/ui/tooltip';

export function SidebarItem({
    icon: Icon,
    label,
    href,
    isActive,
    isCollapsed,
    onClick,
    badge,
    isPrimaryAction
}) {
    const content = (
        <Link
            href={href}
            prefetch={true}
            onClick={onClick}
            aria-current={isActive ? 'page' : undefined}
            className={cn(
                "group relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200",
                isActive
                    ? isPrimaryAction
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent text-primary"
                    : isPrimaryAction
                        ? "text-primary font-medium hover:bg-primary/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
            )}
        >
            <div className={cn(
                "flex items-center justify-center shrink-0 transition-transform duration-200",
                isCollapsed ? "w-full" : "w-6"
            )}>
                <Icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            {!isCollapsed && (
                <span className={cn(
                    "text-sm font-medium tracking-tight whitespace-nowrap",
                    isActive && "font-semibold"
                )}>
                    {label}
                </span>
            )}

            {!isCollapsed && badge && (
                <span className="mr-auto px-1.5 py-0.5 rounded-md bg-secondary text-secondary-foreground text-xs font-semibold">
                    {badge}
                </span>
            )}

            {/* Active indicator (not color-only) */}
            {isActive && !isPrimaryAction && (
                <span
                    aria-hidden="true"
                    className="absolute right-0 top-2 bottom-2 w-1 rounded-full bg-primary transition-all duration-200"
                />
            )}
        </Link>
    );

    if (isCollapsed) {
        return (
            <Tooltip delayDuration={0}>
                <TooltipTrigger asChild>
                    {content}
                </TooltipTrigger>
                <TooltipContent side="left" className="font-bold">
                    {label}
                </TooltipContent>
            </Tooltip>
        );
    }

    return content;
}
