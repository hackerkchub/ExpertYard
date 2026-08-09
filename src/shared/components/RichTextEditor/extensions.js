import StarterKit from "@tiptap/starter-kit";

import Underline from "@tiptap/extension-underline";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import CharacterCount from "@tiptap/extension-character-count";
import Image from "@tiptap/extension-image";

export const editorExtensions = [

    StarterKit.configure({

        heading: {

            levels: [1, 2, 3, 4]

        }

    }),

    Underline,

    Highlight.configure({

        multicolor: true

    }),

    Link.configure({

        openOnClick: false,

        autolink: true,

        linkOnPaste: true,

        HTMLAttributes: {

            target: "_blank",

            rel: "noopener noreferrer"

        }

    }),

    TextAlign.configure({

        types: [

            "heading",

            "paragraph"

        ]

    }),

    Image.configure({

        inline: false,

        allowBase64: true

    }),

    CharacterCount.configure({

        limit: null

    })

];