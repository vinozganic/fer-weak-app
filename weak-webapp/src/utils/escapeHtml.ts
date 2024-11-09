type EntityMap = {
    [key: string]: string;
};

const entityMap: EntityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
    '`': '&#x60;',
    '=': '&#x3D;',
};

export function escapeHtml(text: string) {
    return String(text).replace(/[&<>"'`=\/]/g, function (s) {
        return entityMap[s];
    });
}
