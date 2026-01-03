import { useState } from "react"
import { useEffect } from "react";
import "./notepad.css"

function Notepad() {
    const [note, setNotes] = useState(() => localStorage.getItem("userNote") || "");

    useEffect(() => {
    localStorage.setItem("userNote", note);
  }, [note]);

    return (
        <div className="notepad-container">
            <h1>Notepad</h1>
            <textarea placeholder="Enter any notes"
                      onChange={(e) => setNotes(e.target.value)}
                      value={note}></textarea>
        </div>
    )
}

export default Notepad