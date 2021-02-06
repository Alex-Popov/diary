
export default function saveFile(blob, filename = 'report.pdf') {
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.rel = 'noopener';
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);

    setTimeout(() => {
        URL.revokeObjectURL(a.href);
    }, 4e4); // 40s
    setTimeout(() => {
        a.click();
    }, 0);
};