export function escapeCsvCell(value) {
    const text = value == null ? '' : String(value);
    if (/[",\n\r]/.test(text)) {
        return `"${text.replace(/"/g, '""')}"`;
    }
    return text;
}

export function buildCsv(rows, headers = []) {
    const lines = [];
    if (Array.isArray(headers) && headers.length > 0) {
        lines.push(headers.map(escapeCsvCell).join(','));
    }
    rows.forEach((row) => {
        lines.push(row.map(escapeCsvCell).join(','));
    });
    return '\uFEFF' + lines.join('\n');
}

export function downloadCsv(filename, csvText) {
    const blob = new Blob([csvText], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
}
