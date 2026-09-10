import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext/GlobalContext";
import ArchiveTitleModal from "./ArchiveTitleModal";
import {
    getArchivedNoteById,
    getLinkedArchiveId,
    setLinkedArchiveId,
    upsertArchivedNote,
} from "./archiveStorage";
import GuestNotepadEditor from "./GuestNotepadEditor";
import "./notepad.css"

function Notepad({ isUserDashboard = false, hideHeader = false }) {
    const { userData, refreshData } = useUser();

    // For the user-dashboard textarea path: note = full plain text
    // For the guest Lexical path: note = current plain text (for button state)
    const [note, setNotes] = useState(() =>
        isUserDashboard ? "" : ""
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isGetting, setIsGetting] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [linkedArchiveId, setLinkedArchiveIdState] = useState(() =>
        isUserDashboard ? null : getLinkedArchiveId()
    );

    // Ref to the textarea (user-dashboard only)
    const textareaRef = useRef(null);
    // Ref to the Lexical editor API (guest only)
    const guestEditorRef = useRef(null);

    const linkedArchiveNote = getArchivedNoteById(linkedArchiveId);

    /* ── User-dashboard: Tab key indent ── */
    const handleKeyDown = (e) => {
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        if (e.key === " " && start === end) {
            const lineStart = note.lastIndexOf("\n", start - 1) + 1;
            if (note.slice(lineStart, start) === "-") {
                e.preventDefault();
                const newValue = note.slice(0, lineStart) + "• " + note.slice(start);
                const newCursor = lineStart + 2;
                setNotes(newValue);
                requestAnimationFrame(() => {
                    textarea.selectionStart = newCursor;
                    textarea.selectionEnd = newCursor;
                });
            }
            return;
        }

        if (e.key !== "Tab") return;
        e.preventDefault();
        const indent = "    ";
        const firstLineStart = note.lastIndexOf("\n", start - 1) + 1;
        const lastLineEnd = note.indexOf("\n", end);
        const selectedText = note.slice(firstLineStart, lastLineEnd === -1 ? note.length : lastLineEnd);
        const indentedText = selectedText
            .split("\n")
            .map(line => e.shiftKey ? line.replace(/^ {1,4}/, "") : indent + line)
            .join("\n");
        const newValue = note.slice(0, firstLineStart) + indentedText + note.slice(lastLineEnd === -1 ? note.length : lastLineEnd);
        const cursorShift = e.shiftKey
            ? -(selectedText.length - indentedText.length)
            : indent.length;
        setNotes(newValue);
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.selectionStart = Math.max(firstLineStart, start + cursorShift);
                textareaRef.current.selectionEnd = Math.max(firstLineStart, end + cursorShift);
            }
        });
    };

    /* ── Sync user-dashboard note from userData ── */
    useEffect(() => {
        if (!isUserDashboard) return;
        setNotes(userData?.notepad ?? "");
    }, [isUserDashboard, userData?.notepad]);

    /* ── Persist linked archive id ── */
    useEffect(() => {
        if (isUserDashboard) return;
        setLinkedArchiveId(linkedArchiveId);
    }, [isUserDashboard, linkedArchiveId]);

    /* ── Auto-unlink archive when note is cleared ── */
    useEffect(() => {
        if (isUserDashboard) return;
        if (!note.trim() && linkedArchiveId) {
            setLinkedArchiveIdState(null);
        }
    }, [isUserDashboard, note, linkedArchiveId]);

    /* ── Auto-unlink if linked archive was deleted ── */
    useEffect(() => {
        if (isUserDashboard || !linkedArchiveId) return;
        if (!getArchivedNoteById(linkedArchiveId)) {
            setLinkedArchiveIdState(null);
        }
    }, [isUserDashboard, linkedArchiveId, isArchiveModalOpen]);

    /* ── Reset linked id on user data change ── */
    useEffect(() => {
        if (!isUserDashboard) return;
        setLinkedArchiveIdState(null);
    }, [isUserDashboard, userData?.notepad]);

    /* ── API: sync to server (user-dashboard only) ── */
    const handleSyncNotepad = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setIsSaving(true);
        try {
            const response = await fetch("http://localhost:8080/api/context/save-notepad", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ notepad: note }),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to sync notepad");
            }
            await refreshData();
        } catch (error) {
            console.error("Cannot save notepad:", error);
            alert("Cannot save notepad right now. Try again.");
        } finally {
            setIsSaving(false);
        }
    };

    /* ── API: pull from server (user-dashboard only) ── */
    const handleGetNotepad = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;
        setIsGetting(true);
        try {
            const response = await fetch("http://localhost:8080/api/context/load", {
                method: "GET",
                headers: { Authorization: `Bearer ${token}` },
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || "Failed to load notepad");
            }
            const data = await response.json();
            setNotes(data?.notepad ?? "");
        } catch (error) {
            console.error("Cannot load notepad:", error);
            alert("Cannot load notepad right now. Try again.");
        } finally {
            setIsGetting(false);
        }
    };

    /* ── Archive ── */
    const handleArchiveNote = (title) => {
        // For guest: extract plain text from Lexical editor
        const content = isUserDashboard
            ? note
            : (guestEditorRef.current?.getPlainText() ?? note);
        const { note: savedNote } = upsertArchivedNote(title, content, linkedArchiveId);
        setLinkedArchiveIdState(savedNote.id);
    };

    /* ── Determine if content is empty (for button state) ── */
    const isNoteEmpty = !note.trim();

    return (
        <div className={`notepad-container ${isUserDashboard ? "user-dashboard" : ""}`}>
            {(!hideHeader || isUserDashboard) && (
                <div className="notepad-header">
                    {!hideHeader && <h1>Notepad</h1>}
                    {isUserDashboard && (
                        <div className="notepad-actions">
                            <button
                                type="button"
                                className="add-sync-event-button"
                                onClick={handleGetNotepad}
                                disabled={isSaving || isGetting}
                            >
                                {isGetting ? (
                                    <><span className="button-spinner" /> getting...</>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                        </svg>
                                        get
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                className="add-sync-event-button"
                                onClick={handleSyncNotepad}
                                disabled={isSaving || isGetting}
                            >
                                {isSaving ? (
                                    <><span className="button-spinner" /> saving...</>
                                ) : (
                                    <>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                                        </svg>
                                        sync
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* ── Editor ── */}
            {isUserDashboard ? (
                <textarea
                    ref={textareaRef}
                    placeholder="Enter any notes"
                    onChange={(e) => setNotes(e.target.value)}
                    onKeyDown={handleKeyDown}
                    value={note}
                    maxLength={1000}
                />
            ) : (
                <GuestNotepadEditor
                    onTextChange={setNotes}
                    editorRef={guestEditorRef}
                />
            )}

            {/* ── Footer ── */}
            <div className="notepad-footer">
                <button
                    type="button"
                    className="archive-note-button"
                    onClick={() => setIsArchiveModalOpen(true)}
                    disabled={isNoteEmpty}
                >
                    {linkedArchiveNote ? "Update Archive" : "Save to Archive"}
                </button>
                {isUserDashboard && (
                    <p className="note-character-count">{note.length}/1000</p>
                )}
            </div>

            <ArchiveTitleModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onSave={handleArchiveNote}
                existingTitle={linkedArchiveNote?.title ?? ""}
                isUpdate={Boolean(linkedArchiveNote)}
            />
        </div>
    );
}

export default Notepad;
