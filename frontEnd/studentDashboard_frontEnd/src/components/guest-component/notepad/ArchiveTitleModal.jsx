import { useEffect, useState } from "react";
import "./ArchiveTitleModal.css";

function ArchiveTitleModal({ isOpen, onClose, onSave, existingTitle = "", isUpdate = false }) {
    const [title, setTitle] = useState("");

    useEffect(() => {
        if (!isOpen) return;

        setTitle(existingTitle);
        document.documentElement.classList.add("archive-modal-open");
        document.body.classList.add("archive-modal-open");

        return () => {
            document.documentElement.classList.remove("archive-modal-open");
            document.body.classList.remove("archive-modal-open");
        };
    }, [isOpen, existingTitle]);

    if (!isOpen) return null;

    const handleSave = () => {
        if (!title.trim()) return;
        onSave(title.trim());
        setTitle("");
        onClose();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleSave();
        }
    };

    return (
        <div className="archive-modal-overlay" onClick={onClose}>
            <div
                className="archive-modal-container"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="archive-modal-header">
                    <h2 className="archive-modal-title">
                        {isUpdate ? "Update Archive" : "Save to Archive"}
                    </h2>
                    <button
                        type="button"
                        className="archive-modal-close"
                        aria-label="Close"
                        onClick={onClose}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="archive-modal-body">
                    <label htmlFor="archive-note-title">Note title</label>
                    <input
                        id="archive-note-title"
                        type="text"
                        placeholder="Enter a title for this note"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        onKeyDown={handleKeyDown}
                        autoFocus
                        maxLength={100}
                    />
                    <button
                        type="button"
                        className="archive-modal-save"
                        onClick={handleSave}
                        disabled={!title.trim()}
                    >
                        {isUpdate ? "Update Archive" : "Save to Archive"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ArchiveTitleModal;
