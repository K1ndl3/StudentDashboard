import { useState } from "react";
import { useEffect } from "react";
import { useUser } from "../../context/UserContext/GlobalContext";
import "./notepad.css"

function Notepad({ isUserDashboard = false }) {
    const { userData, refreshData } = useUser();
    const [note, setNotes] = useState(() =>
        isUserDashboard ? "" : localStorage.getItem("userNote") || ""
    );
    const [isSaving, setIsSaving] = useState(false);

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

    return (
        <div className={`notepad-container ${isUserDashboard ? "user-dashboard" : ""}`}>
            <div className="notepad-header">
                <h1>Notepad</h1>
                {isUserDashboard && (
                    <button
                        type="button"
                        className="add-sync-event-button"
                        onClick={handleSyncNotepad}
                        disabled={isSaving}
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
                )}
            </div>
            <textarea placeholder="Enter any notes"
                      onChange={(e) => setNotes(e.target.value)}
                      value={note}
                      maxLength={1000}></textarea>
            {isUserDashboard && <p className="note-character-count">{note.length}/1000</p>}
        </div>
    )
}

export default Notepad