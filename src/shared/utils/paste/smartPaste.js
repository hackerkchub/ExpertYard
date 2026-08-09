import { detectContentType } from "./detectContentType";
import { markdownToHtml } from "./markdownToHtml";
import { cleanHtml } from "./htmlCleaner";
import { beautifyHtml } from "./beautifyHtml";

export function smartPaste(input) {

    let html = input;

    const type = detectContentType(input);

    switch (type) {

        case "markdown":
            html = markdownToHtml(input);
            break;

        case "html":
            html = input;
            break;

        default:
            html = `<p>${input}</p>`;
    }

    html = cleanHtml(html);

    html = beautifyHtml(html);

    return html;
}