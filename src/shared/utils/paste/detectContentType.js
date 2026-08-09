export function detectContentType(text) {

    if (!text) return "plain";

    // HTML
    if (/<[a-z][\s\S]*>/i.test(text)) {
        return "html";
    }

    // Markdown
    if (
        /^#{1,6}\s/m.test(text) ||
        /^\*\s/m.test(text) ||
        /^-\s/m.test(text) ||
        /^\d+\.\s/m.test(text)
    ) {
        return "markdown";
    }

    return "plain";
}