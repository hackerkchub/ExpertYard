export function beautifyHtml(html) {
    if (!html) return "";

    return html
        .replace(/<p>\s*<\/p>/g, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}