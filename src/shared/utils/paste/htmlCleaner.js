/**
 * Clean and sanitize HTML content
 */
export const cleanHtml = (html) => {
    if (!html) return '';
    
    let cleaned = html;
    
    // Remove script tags
    cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    
    // Remove style tags
    cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');
    
    // Remove empty paragraphs
    cleaned = cleaned.replace(/<p>\s*<\/p>/gi, '');
    
    // Remove multiple line breaks
    cleaned = cleaned.replace(/(<br\s*\/?>\s*){2,}/gi, '<br />');
    
    // Trim whitespace
    cleaned = cleaned.trim();
    
    return cleaned;
};