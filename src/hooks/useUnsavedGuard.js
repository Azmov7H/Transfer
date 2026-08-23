'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Protects editors from losing unsaved work (FORM-002).
 * Covers tab close/refresh (beforeunload), link clicks (capture phase)
 * and browser back (popstate with re-push fallback). Only active while dirty.
 */
export function useUnsavedGuard(isDirty, message = 'لديك تغييرات غير محفوظة، هل أنت متأكد من المغادرة؟') {
    const router = useRouter();
    const dirtyRef = useRef(isDirty);
    const armedRef = useRef(true);

    useEffect(() => {
        dirtyRef.current = isDirty;
    }, [isDirty]);

    useEffect(() => {
        const blocked = () => dirtyRef.current && armedRef.current;

        const handleBeforeUnload = (e) => {
            if (blocked()) {
                e.preventDefault();
                e.returnValue = message;
                return message;
            }
        };

        const handleClickCapture = (e) => {
            if (!blocked()) return;
            if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey) return;
            const anchor = e.target.closest?.('a[href]');
            if (!anchor || anchor.target === '_blank' || anchor.getAttribute('href')?.startsWith('#')) return;
            if (!window.confirm(message)) {
                e.preventDefault();
                e.stopPropagation();
            }
        };

        const lastHref = window.location.href;
        const handlePopState = () => {
            if (blocked() && !window.confirm(message)) {
                window.location.replace(lastHref);
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);
        document.addEventListener('click', handleClickCapture, true);
        window.addEventListener('popstate', handlePopState);
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            document.removeEventListener('click', handleClickCapture, true);
            window.removeEventListener('popstate', handlePopState);
        };
    }, [message]);

    return {
        /** Disarm the guard after a successful save */
        disarm: () => { armedRef.current = false; },
        arm: () => { armedRef.current = true; },
    };
}
