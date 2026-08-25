import { useEffect, useMemo, useState } from "react";
import {
    loadArchivedNotes,
    updateArchivedNote,
    deleteArchivedNote,
    formatDisplayDate,
} from "./archiveStorage";
import "./ArchivedNotes.css";

function getPreview(content, maxLength = 140) {
    const trimmed = content.trim().replace(/\s+/g, " ");
    if (!trimmed) return "No content";
    if (trimmed.length <= maxLength) return trimmed;
    return `${trimmed.slice(0, maxLength).trim()}…`;
}

function groupNotesByDate(notes) {
    const groups = new Map();

    for (const note of notes) {
        if (!groups.has(note.date)) {
            groups.set(note.date, []);
        }
        groups.get(note.date).push(note);
    }

    return [...groups.entries()]
        .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
        .map(([date, groupNotes]) => [
            date,
            [...groupNotes].sort((a, b) => a.title.localeCompare(b.title)),
        ]);
}

function ArchivedNotes() {
    const [notes, setNotes] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [editContent, setEditContent] = useState("");

    useEffect(() => {
        setNotes(loadArchivedNotes());
    }, []);

    useEffect(() => {
        if (!activeNoteId) return;

        document.documentElement.classList.add("archived-note-modal-open");
        document.body.classList.add("archived-note-modal-open");

        return () => {
            document.documentElement.classList.remove("archived-note-modal-open");
            document.body.classList.remove("archived-note-modal-open");
        };
    }, [activeNoteId]);

    const activeNote = notes.find((note) => note.id === activeNoteId) ?? null;

    const filteredNotes = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) return notes;

        return notes.filter(
            (note) =>
                note.title.toLowerCase().includes(query) ||
                note.content.toLowerCase().includes(query) ||
                formatDisplayDate(note.date).toLowerCase().includes(query)
        );
    }, [notes, searchQuery]);

    const groupedNotes = useMemo(
        () => groupNotesByDate(filteredNotes),
        [filteredNotes]
    );

    const openNote = (note) => {
        setActiveNoteId(note.id);
        setEditTitle(note.title);
        setEditContent(note.content);
    };

    const closeNote = () => {
        setActiveNoteId(null);
        setEditTitle("");
        setEditContent("");
    };

    const handleSave = () => {
        if (!activeNoteId || !editTitle.trim()) return;
        const updated = updateArchivedNote(activeNoteId, {
            title: editTitle.trim(),
            content: editContent,
        });
        setNotes(updated);
        closeNote();
    };

    const handleDelete = () => {
        if (!activeNoteId) return;
        const updated = deleteArchivedNote(activeNoteId);
        setNotes(updated);
        closeNote();
    };

    return (
        <div className="archived-notes-page">
            <div className="archived-notes-panel">
                <header className="archived-notes-header">
                    <div className="archived-notes-header-main">
                        <div className="archived-notes-brand">
                            <div className="archived-notes-brand-icon" aria-hidden="true">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            </div>
                            <div>
                                <h1>Archived Notes</h1>
                                <p className="archived-notes-subtitle">
                                    Saved snapshots from your notepad, organized by date.
                                </p>
                            </div>
                        </div>
                        {notes.length > 0 && (
                            <span className="archived-notes-count">
                                {notes.length} {notes.length === 1 ? "note" : "notes"}
                            </span>
                        )}
                    </div>

                    {notes.length > 0 && (
                        <div className="archived-notes-search">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                            <input
                                type="search"
                                placeholder="Search by title, content, or date…"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    )}
                </header>

                <div className="archived-notes-body">
                    {notes.length === 0 ? (
                        <div className="archived-notes-empty">
                            <div className="archived-notes-empty-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
                                </svg>
                            </div>
                            <h2>Nothing archived yet</h2>
                            <p>
                                Use the archive button in your notepad to save notes here.
                                Each entry keeps its title and the date it was saved.
                            </p>
                        </div>
                    ) : filteredNotes.length === 0 ? (
                        <div className="archived-notes-empty archived-notes-empty--compact">
                            <h2>No matches found</h2>
                            <p>Try a different search term or clear the filter.</p>
                            <button
                                type="button"
                                className="archived-notes-clear-search"
                                onClick={() => setSearchQuery("")}
                            >
                                Clear search
                            </button>
                        </div>
                    ) : (
                        <div className="archived-notes-groups">
                            {groupedNotes.map(([date, groupNotes]) => (
                                <section key={date} className="archived-notes-group">
                                    <div className="archived-notes-group-header">
                                        <h2>{formatDisplayDate(date)}</h2>
                                        <span>{groupNotes.length}</span>
                                    </div>
                                    <div className="archived-notes-grid">
                                        {groupNotes.map((note) => (
                                            <button
                                                key={note.id}
                                                type="button"
                                                className="archived-note-card"
                                                onClick={() => openNote(note)}
                                            >
                                                <div className="archived-note-card-top">
                                                    <span className="archived-note-card-title">{note.title}</span>
                                                    <span className="archived-note-card-open" aria-hidden="true">
                                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                        </svg>
                                                    </span>
                                                </div>
                                                <p className="archived-note-card-preview">
                                                    {getPreview(note.content)}
                                                </p>
                                                <div className="archived-note-card-footer">
                                                    <span className="archived-note-card-chip">
                                                        {note.content.trim().length} chars
                                                    </span>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {activeNote && (
                <div className="archived-note-modal-overlay" onClick={closeNote}>
                    <div
                        className="archived-note-modal"
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="archived-note-modal-title"
                    >
                        <div className="archived-note-modal-header">
                            <div className="archived-note-modal-meta">
                                <span className="archived-note-modal-label">Title</span>
                                <input
                                    id="archived-note-modal-title"
                                    type="text"
                                    className="archived-note-edit-title"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    maxLength={100}
                                />
                                <span className="archived-note-modal-date">
                                    Archived on {formatDisplayDate(activeNote.date)}
                                </span>
                            </div>
                            <button
                                type="button"
                                className="archived-note-modal-close"
                                aria-label="Close"
                                onClick={closeNote}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        <div className="archived-note-modal-editor">
                            <label className="archived-note-modal-label" htmlFor="archived-note-modal-content">
                                Content
                            </label>
                            <textarea
                                id="archived-note-modal-content"
                                className="archived-note-edit-content"
                                value={editContent}
                                onChange={(e) => setEditContent(e.target.value)}
                                maxLength={1000}
                            />
                        </div>

                        <div className="archived-note-actions">
                            <span className="archived-note-char-count">
                                {editContent.length}/1000
                            </span>
                            <div className="archived-note-action-buttons">
                                <button
                                    type="button"
                                    className="archived-note-delete"
                                    onClick={handleDelete}
                                >
                                    Delete note
                                </button>
                                <button
                                    type="button"
                                    className="archived-note-save"
                                    onClick={handleSave}
                                    disabled={!editTitle.trim()}
                                >
                                    Save changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default ArchivedNotes;
