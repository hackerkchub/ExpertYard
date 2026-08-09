import React, { useState } from "react";

import {
    Undo2,
    Redo2,

    Bold,
    Italic,
    Underline,

    Highlighter,

    Heading1,
    Heading2,
    Heading3,

    List,
    ListOrdered,

    Quote,

    Minus,

    Link2,

    Eye,

    Bot,

    Image

} from "lucide-react";

export default function Toolbar({

    editor,

    onAiPaste,

    onPreview

}) {

    const [url, setUrl] = useState("");

    if (!editor) return null;

    const addLink = () => {

        const previous = editor.getAttributes("link").href;

        const link = window.prompt("Enter URL", previous);

        if (link === null) return;

        if (link === "") {

            editor.chain().focus().unsetLink().run();

            return;

        }

        editor.chain().focus().setLink({

            href: link

        }).run();

    };

    return (

        <div className="rich-toolbar">

            {/* Undo */}

            <div className="rich-toolbar-group">

                <button
                    onClick={() => editor.chain().focus().undo().run()}
                    title="Undo"
                >

                    <Undo2 size={18} />

                </button>

                <button
                    onClick={() => editor.chain().focus().redo().run()}
                    title="Redo"
                >

                    <Redo2 size={18} />

                </button>

            </div>

            {/* Heading */}

            <div className="rich-toolbar-group">

                <button
                    className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 1 }).run()
                    }
                >

                    <Heading1 size={18} />

                </button>

                <button
                    className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 2 }).run()
                    }
                >

                    <Heading2 size={18} />

                </button>

                <button
                    className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
                    onClick={() =>
                        editor.chain().focus().toggleHeading({ level: 3 }).run()
                    }
                >

                    <Heading3 size={18} />

                </button>

            </div>

            {/* Text */}

            <div className="rich-toolbar-group">

                <button
                    className={editor.isActive("bold") ? "is-active" : ""}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                >

                    <Bold size={18} />

                </button>

                <button
                    className={editor.isActive("italic") ? "is-active" : ""}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                >

                    <Italic size={18} />

                </button>

                <button
                    className={editor.isActive("underline") ? "is-active" : ""}
                    onClick={() => editor.chain().focus().toggleUnderline().run()}
                >

                    <Underline size={18} />

                </button>

                <button
                    className={editor.isActive("highlight") ? "is-active" : ""}
                    onClick={() => editor.chain().focus().toggleHighlight().run()}
                >

                    <Highlighter size={18} />

                </button>

            </div>

            {/* Lists */}

            <div className="rich-toolbar-group">

                <button
                    className={editor.isActive("bulletList") ? "is-active" : ""}
                    onClick={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >

                    <List size={18} />

                </button>

                <button
                    className={editor.isActive("orderedList") ? "is-active" : ""}
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                >

                    <ListOrdered size={18} />

                </button>

            </div>

            {/* Quote */}

            <div className="rich-toolbar-group">

                <button
                    className={editor.isActive("blockquote") ? "is-active" : ""}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                >

                    <Quote size={18} />

                </button>

                <button
                    onClick={() =>
                        editor.chain().focus().setHorizontalRule().run()
                    }
                >

                    <Minus size={18} />

                </button>

            </div>

            {/* Link */}

            <div className="rich-toolbar-group">

                <button onClick={addLink}>

                    <Link2 size={18} />

                </button>

            </div>

            {/* Image (Coming Soon) */}

            <div className="rich-toolbar-group">

                <button
                    disabled
                    title="Image Upload (Coming Soon)"
                >

                    <Image size={18} />

                </button>

            </div>

            {/* AI */}

            <div className="rich-toolbar-group">

                <button
                    onClick={onAiPaste}
                    title="Paste from AI"
                >

                    <Bot size={18} />

                </button>

            </div>

            {/* Preview */}

            <div className="rich-toolbar-group">

                <button
                    onClick={onPreview}
                    title="Preview"
                >

                    <Eye size={18} />

                </button>

            </div>

        </div>

    );

}