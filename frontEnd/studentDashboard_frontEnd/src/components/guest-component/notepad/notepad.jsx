import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext/GlobalContext";
import ArchiveTitleModal from "./ArchiveTitleModal";
import {
    getArchivedNoteById,
    getLinkedArchiveId,
    setLinkedArchiveId,
    upsertArchivedNote,
} from "./archiveStorage";
import {
    createUserArchivedNote,
    loadUserArchivedNotes,
    updateUserArchivedNote,
} from "./userArchiveApi";
import GuestNotepadEditor from "./GuestNotepadEditor";
import "./notepad.css"

function Notepad({ isUserDashboard = false, hideHeader = false }) {
    const { userData } = useUser();

    // For the user-dashboard textarea path: note = full plain text
    // For the guest Lexical path: note = current plain text (for button state)
    const [note, setNotes] = useState(() =>
        isUserDashboard ? "" : ""
    );
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [isArchivePickerOpen, setIsArchivePickerOpen] = useState(false);
    const [archivedNotes, setArchivedNotes] = useState([]);
    const [isLoadingArchive, setIsLoadingArchive] = useState(false);
    const [linkedArchiveId, setLinkedArchiveIdState] = useState(() =>
        isUserDashboard ? null : getLinkedArchiveId()
    );

    // Ref to the Lexical editor API
    const guestEditorRef = useRef(null);

    const linkedArchiveNote = isUserDashboard
        ? archivedNotes.find((archivedNote) => archivedNote.id === linkedArchiveId) ?? null
        : getArchivedNoteById(linkedArchiveId);

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

    /* ── Archive ── */
    const handleArchiveNote = async (title) => {
        const content = (guestEditorRef.current?.getPlainText() ?? note)
            // Lexical separates adjacent paragraphs with two newline characters.
            // Archive entries are displayed as plain text, so retain one line break.
            .replace(/\n{2,}/g, "\n");

        try {
            if (isUserDashboard) {
                const savedNote = linkedArchiveId
                    ? await updateUserArchivedNote(linkedArchiveId, { title, content })
                    : await createUserArchivedNote(title, content);
                setArchivedNotes((current) => [
                    savedNote,
                    ...current.filter((archivedNote) => archivedNote.id !== savedNote.id),
                ]);
                setLinkedArchiveIdState(savedNote.id);
                return;
            }

            const { note: savedNote } = upsertArchivedNote(title, content, linkedArchiveId);
            setLinkedArchiveIdState(savedNote.id);
        } catch (error) {
            console.error("Cannot archive note:", error);
            alert("Cannot archive this note right now. Try again.");
        }
    };

    const openArchivePicker = async () => {
        setIsArchivePickerOpen(true);
        setIsLoadingArchive(true);
        try {
            setArchivedNotes(await loadUserArchivedNotes());
        } catch (error) {
            console.error("Cannot load archived notes:", error);
            alert("Cannot load archived notes right now. Try again.");
            setIsArchivePickerOpen(false);
        } finally {
            setIsLoadingArchive(false);
        }
    };

    const selectArchivedNote = (archivedNote) => {
        setLinkedArchiveIdState(archivedNote.id);
        setNotes(archivedNote.content);
        guestEditorRef.current?.setPlainText(archivedNote.content);
        setIsArchivePickerOpen(false);
    };

    /* ── Determine if content is empty (for button state) ── */
    const isNoteEmpty = !note.trim();

    return (
        <div className={`notepad-container ${isUserDashboard ? "user-dashboard" : ""}`}>
            {(!hideHeader || isUserDashboard) && (
                <div className="notepad-header">
                    {!hideHeader && <h1>Notepad</h1>}
                </div>
            )}

            {/* ── Editor ── */}
            <GuestNotepadEditor
                onTextChange={setNotes}
                editorRef={guestEditorRef}
                initialText={isUserDashboard ? (userData?.notepad ?? "") : undefined}
                persistLocally={!isUserDashboard}
            />

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
                    <button
                        type="button"
                        className="archive-note-button select-archive-button"
                        onClick={openArchivePicker}
                    >
                        Select Archive
                    </button>
                )}
                {isUserDashboard && (
                    <p className="note-character-count">{note.length}/10000</p>
                )}
            </div>

            <ArchiveTitleModal
                isOpen={isArchiveModalOpen}
                onClose={() => setIsArchiveModalOpen(false)}
                onSave={handleArchiveNote}
                existingTitle={linkedArchiveNote?.title ?? ""}
                isUpdate={Boolean(linkedArchiveNote)}
            />

            {isUserDashboard && isArchivePickerOpen && (
                <div className="archive-picker-overlay" onClick={() => setIsArchivePickerOpen(false)}>
                    <div className="archive-picker" onClick={(event) => event.stopPropagation()}>
                        <div className="archive-picker-header">
                            <h2>Select an archived note</h2>
                            <button type="button" onClick={() => setIsArchivePickerOpen(false)} aria-label="Close">
                                ×
                            </button>
                        </div>
                        {isLoadingArchive ? (
                            <p className="archive-picker-message">Loading archived notes…</p>
                        ) : archivedNotes.length === 0 ? (
                            <p className="archive-picker-message">No archived notes yet.</p>
                        ) : (
                            <div className="archive-picker-list">
                                {archivedNotes.map((archivedNote) => (
                                    <button
                                        key={archivedNote.id}
                                        type="button"
                                        className={archivedNote.id === linkedArchiveId ? "is-selected" : ""}
                                        onClick={() => selectArchivedNote(archivedNote)}
                                    >
                                        <strong>{archivedNote.title}</strong>
                                        <span>{archivedNote.content || "No content"}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Notepad;
