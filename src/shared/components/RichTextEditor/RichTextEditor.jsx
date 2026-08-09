import React, { useEffect, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";

import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";

import { Table } from "@tiptap/extension-table";

import { TableRow } from "@tiptap/extension-table-row";

import { TableCell } from "@tiptap/extension-table-cell";

import { TableHeader } from "@tiptap/extension-table-header";

import Image from "@tiptap/extension-image";

import Toolbar from "./Toolbar";
import AiPasteModal from "./AiPasteModal";

import { smartPaste } from "../../utils/paste/smartPaste";

import "./editor.css";

export default function RichTextEditor({
    value = "",
    onChange,
    editable = true,
    placeholder = "Start writing..."
}) {
    const [previewMode, setPreviewMode] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);

    const editor = useEditor({
        editable,
        extensions: [
            StarterKit,
            Underline,
            Highlight,
            Link.configure({
                openOnClick: false,
                autolink: true
            }),
            TextAlign.configure({
                types: ["heading", "paragraph"]
            }),
            Table.configure({
                resizable: true
            }),
            TableRow,
            TableCell,
            TableHeader,
            Image,
            CharacterCount
        ],
        content: value,
        editorProps: {
            attributes: {
                class: "ProseMirror"  // ✅ ProseMirror class set ki
            },
            // ✅ Stage 7.3: Sirf paste detect karna hai
            handlePaste(view, event) {
                const html = event.clipboardData.getData("text/html");
                const text = event.clipboardData.getData("text/plain");
                
                console.log("📋 HTML:", html);
                console.log("📝 TEXT:", text);
                
                return false;  // ✅ Abhi browser ko normal paste karne do
            }
        },
        onUpdate({ editor }) {
            onChange?.(editor.getHTML());
        }
    });

    useEffect(() => {
        if (!editor) return;
        if (editor.getHTML() !== value) {
            editor.commands.setContent(value || "");
        }
    }, [value, editor]);

    const handleAiImport = (text) => {
        const html = smartPaste(text);
        editor.commands.setContent(html);
    };

    if (!editor) return null;

    return (
        <div className="rich-editor-wrapper">
            <Toolbar
                editor={editor}
                onAiPaste={() => setShowAiModal(true)}
                onPreview={() => setPreviewMode(!previewMode)}
            />
            {
                previewMode ?
                (
                    <div
                        className="legal-preview"
                        dangerouslySetInnerHTML={{
                            __html: editor.getHTML()
                        }}
                    />
                )
                :
                (
                    <EditorContent editor={editor} />
                )
            }
            <div className="editor-footer">
                <div>Words: {editor.storage.characterCount.words()}</div>
                <div>Characters: {editor.storage.characterCount.characters()}</div>
            </div>
            <AiPasteModal
                open={showAiModal}
                onClose={() => setShowAiModal(false)}
                onImport={handleAiImport}
            />
        </div>
    );
}