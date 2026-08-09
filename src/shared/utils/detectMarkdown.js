/**
 * Detect if text contains Markdown syntax
 */
export const isMarkdown = (text) => {
    if (!text || typeof text !== 'string') return false;
    
    // Common Markdown patterns
    const markdownPatterns = [
        /^#+\s+/,                           // Headings
        /^[-*+]\s+/,                        // Unordered lists
        /^\d+\.\s+/,                        // Ordered lists
        /^>+\s+/,                           // Blockquotes
        /^```/,                             // Code blocks
        /`[^`]+`/,                          // Inline code
        /\[[^\]]+\]\([^)]+\)/,              // Links
        /!\[[^\]]*\]\([^)]+\)/,             // Images
        /^---$/m,                           // Horizontal rules
        /\*\*[^*]+\*\*/,                    // Bold
        /\*[^*]+\*/,                        // Italic
        /__[^_]+__/,                        // Bold (alternative)
        /_[^_]+_/                           // Italic (alternative)
    ];
    
    return markdownPatterns.some(pattern => pattern.test(text));
};