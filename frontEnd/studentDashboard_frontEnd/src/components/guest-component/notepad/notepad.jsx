import { useState, useEffect, useRef } from "react";
import { useUser } from "../../context/UserContext/GlobalContext";
import "./notepad.css"

function Notepad({ isUserDashboard = false, hideHeader = false }) {
    const { userData, refreshData } = useUser();
    const [note, setNotes] = useState(() =>
        isUserDashboard ? "" : localStorage.getItem("userNote") || ""
    );
    const [isSaving, setIsSaving] = useState(false);
    const [isGetting, setIsGetting] = useState(false);
    const textareaRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key !== "Tab") return;

        e.preventDefault();
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const indent = "    ";
        const newValue = note.slice(0, start) + indent + note.slice(end);
        const newCursor = start + indent.length;

        setNotes(newValue);
        requestAnimationFrame(() => {
            if (textareaRef.current) {
                textareaRef.current.selectionStart = newCursor;
                textareaRef.current.selectionEnd = newCursor;
            }
        });
    };

    useEffect(() => {
        if (!isUserDashboard) return;
        setNotes(userData?.notepad ?? "");
    }, [isUserDashboard, userData?.notepad]);

    useEffect(() => {
        if (isUserDashboard) return;
        localStorage.setItem("userNote", note);
    }, [isUserDashboard, note]);

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
                body: JSON.stringify({
                    notepad: note,
                }),
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

    const handleGetNotepad = async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        setIsGetting(true);
        try {
            const response = await fetch("http://localhost:8080/api/context/load", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
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
                                <>
                                    <span className="button-spinner" />
                                    getting...
                                </>
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
                                <>
                                    <span className="button-spinner" />
                                    saving...
                                </>
                            ) : (
                                <>
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth={1.5}
                                        stroke="currentColor"
                                        className="size-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                                        />
                                    </svg>
                                    sync
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
            )}
            <textarea
                ref={textareaRef}
                placeholder="Enter any notes"
                onChange={(e) => setNotes(e.target.value)}
                onKeyDown={handleKeyDown}
                value={note}
                maxLength={1000}
            />
            {isUserDashboard && <p className="note-character-count">{note.length}/1000</p>}
        </div>
    )
}

export default Notepad