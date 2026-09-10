import { useEffect, useRef, useState } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import { TabIndentationPlugin } from "@lexical/react/LexicalTabIndentationPlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListItemNode, ListNode } from "@lexical/list";
import { ORDERED_LIST, UNORDERED_LIST } from "@lexical/markdown";
import {
    $getRoot,
    $createParagraphNode,
    $createTextNode,
    FORMAT_TEXT_COMMAND,
    SELECTION_CHANGE_COMMAND,
    KEY_TAB_COMMAND,
    INDENT_CONTENT_COMMAND,
    OUTDENT_CONTENT_COMMAND,
    $getSelection,
    $isRangeSelection,
    COMMAND_PRIORITY_LOW,
} from "lexical";

const STORAGE_KEY = "userNote_rich";
const LEGACY_KEY = "userNote";

/* Only list transformers are enabled — other markdown transformers need
   nodes (heading, quote, code, link) this editor does not register. */
const MARKDOWN_TRANSFORMERS = [UNORDERED_LIST, ORDERED_LIST];

/* ─── Migrate / load persisted state ──────────────────────────── */
function LoadStatePlugin() {
    const [editor] = useLexicalComposerContext();
    const loaded = useRef(false);

    useEffect(() => {
        if (loaded.current) return;
        loaded.current = true;

        const richRaw = localStorage.getItem(STORAGE_KEY);
        if (richRaw) {
            try {
                const parsed = editor.parseEditorState(richRaw);
                if (!parsed.isEmpty()) {
                    editor.setEditorState(parsed);
                    return;
                }
            } catch {
                /* fall through */
            }
        }

        const legacy = localStorage.getItem(LEGACY_KEY);
        if (legacy && legacy.trim()) {
            editor.update(() => {
                const root = $getRoot();
                root.clear();
                const para = $createParagraphNode();
                para.append($createTextNode(legacy));
                root.append(para);
            });
            localStorage.removeItem(LEGACY_KEY);
        }
    }, [editor]);

    return null;
}

/* ─── Tab indents the current line, wherever the caret sits ────── */
function TabIndentPlugin() {
    const [editor] = useLexicalComposerContext();

    useEffect(() => {
        return editor.registerCommand(
            KEY_TAB_COMMAND,
            (event) => {
                if (!$isRangeSelection($getSelection())) return false;
                event.preventDefault();
                editor.dispatchCommand(
                    event.shiftKey ? OUTDENT_CONTENT_COMMAND : INDENT_CONTENT_COMMAND
                );
                return true;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    return null;
}

/* ─── Expose plain-text extraction via ref ─────────────────────── */
function EditorRefPlugin({ editorRef }) {
    const [editor] = useLexicalComposerContext();
    useEffect(() => {
        if (!editorRef) return;
        editorRef.current = {
            getPlainText() {
                let text = "";
                editor.getEditorState().read(() => {
                    text = $getRoot().getTextContent();
                });
                return text;
            },
            isEmpty() {
                let empty = true;
                editor.getEditorState().read(() => {
                    empty = $getRoot().getTextContent().trim() === "";
                });
                return empty;
            },
        };
    }, [editor, editorRef]);
    return null;
}

/* ─── Formatting toolbar (must live inside LexicalComposer) ──────── */
function Toolbar() {
    const [editor] = useLexicalComposerContext();
    const [active, setActive] = useState({ bold: false, italic: false, underline: false });

    useEffect(() => {
        return editor.registerCommand(
            SELECTION_CHANGE_COMMAND,
            () => {
                const sel = $getSelection();
                if ($isRangeSelection(sel)) {
                    setActive({
                        bold: sel.hasFormat("bold"),
                        italic: sel.hasFormat("italic"),
                        underline: sel.hasFormat("underline"),
                    });
                }
                return false;
            },
            COMMAND_PRIORITY_LOW
        );
    }, [editor]);

    const dispatch = (fmt) => (e) => {
        e.preventDefault();
        editor.dispatchCommand(FORMAT_TEXT_COMMAND, fmt);
    };

    return (
        <div className="notepad-toolbar" aria-label="Formatting toolbar">
            <button
                type="button"
                className={`toolbar-btn${active.bold ? " active" : ""}`}
                onMouseDown={dispatch("bold")}
                title="Bold (Ctrl+B)"
                aria-label="Bold"
                aria-pressed={active.bold}
            >
                <strong>B</strong>
            </button>
            <button
                type="button"
                className={`toolbar-btn${active.italic ? " active" : ""}`}
                onMouseDown={dispatch("italic")}
                title="Italic (Ctrl+I)"
                aria-label="Italic"
                aria-pressed={active.italic}
            >
                <em>I</em>
            </button>
            <button
                type="button"
                className={`toolbar-btn${active.underline ? " active" : ""}`}
                onMouseDown={dispatch("underline")}
                title="Underline (Ctrl+U)"
                aria-label="Underline"
                aria-pressed={active.underline}
            >
                <u>U</u>
            </button>
            <div className="toolbar-sep" aria-hidden="true" />
            <span className="toolbar-hint">Tab indent · Type “- ” for bullets · Ctrl+Z undo</span>
        </div>
    );
}

/* ─── Main export ──────────────────────────────────────────────── */
export default function GuestNotepadEditor({ onTextChange, editorRef }) {
    const initialConfig = {
        namespace: "GuestNotepad",
        onError: (err) => console.error("[GuestNotepad]", err),
        theme: {
            text: {
                bold: "notepad-text-bold",
                italic: "notepad-text-italic",
                underline: "notepad-text-underline",
            },
            list: {
                ul: "notepad-list-ul",
                ol: "notepad-list-ol",
                listitem: "notepad-list-item",
                nested: { listitem: "notepad-list-item-nested" },
            },
            indent: "notepad-indent",
        },
        nodes: [ListNode, ListItemNode],
    };

    return (
        <LexicalComposer initialConfig={initialConfig}>
            <Toolbar />
            <div className="notepad-editor-wrapper">
                <RichTextPlugin
                    contentEditable={
                        <ContentEditable
                            className="notepad-rich-editor"
                            aria-label="Notes editor"
                            aria-multiline="true"
                        />
                    }
                    placeholder={
                        <div className="notepad-rich-placeholder">
                            Enter any notes…
                        </div>
                    }
                    ErrorBoundary={LexicalErrorBoundary}
                />
            </div>
            <HistoryPlugin />
            <ListPlugin />
            <TabIndentationPlugin maxIndent={7} />
            <TabIndentPlugin />
            <MarkdownShortcutPlugin transformers={MARKDOWN_TRANSFORMERS} />
            <LoadStatePlugin />
            <OnChangePlugin
                onChange={(editorState) => {
                    const json = JSON.stringify(editorState.toJSON());
                    localStorage.setItem(STORAGE_KEY, json);
                    editorState.read(() => {
                        if (onTextChange) onTextChange($getRoot().getTextContent());
                    });
                }}
            />
            <EditorRefPlugin editorRef={editorRef} />
        </LexicalComposer>
    );
}
