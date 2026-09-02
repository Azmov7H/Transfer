'use client';

/**
 * DOC-SHARED-005 — Shared @media print styles.
 *
 * Mount this ONCE inside the document root; it hides the app chrome
 * (header, sidebar, nav) and forces an A4 page so every document prints
 * the same way.
 *
 * Replaces the per-page <style jsx global> blocks that were scattered
 * across InvoicePrintView, receipts/[id]/page.jsx and the partner-
 * transaction dialog. The behavior is identical but lives in one
 * place.
 */
export function DocumentPrintStyles() {
    return (
        <style jsx global>{`
            @page {
                size: A4;
                margin: 20mm;
            }
            @media print {
                html, body {
                    background: white !important;
                    margin: 0 !important;
                    padding: 0 !important;
                }
                /* Hide the app chrome */
                header,
                aside,
                nav,
                .print\\:hidden,
                .header-actions,
                .no-print,
                [data-no-print] {
                    display: none !important;
                }
                /* Color fidelity — backgrounds and borders print */
                *,
                *::before,
                *::after {
                    -webkit-print-color-adjust: exact !important;
                    print-color-adjust: exact !important;
                }
                main,
                .container,
                [data-document-root] {
                    margin: 0 !important;
                    padding: 0 !important;
                    max-width: 100% !important;
                }
                /* Long tables: keep header / footer groups on every page */
                thead {
                    display: table-header-group;
                }
                tfoot {
                    display: table-footer-group;
                }
                tr {
                    page-break-inside: avoid;
                }
                /* Forced breaks */
                .page-break-before {
                    page-break-before: always;
                }
                .page-break-after {
                    page-break-after: always;
                }
            }
        `}</style>
    );
}
