// TaskModal.js
import { useState } from "react";
import "./TaskModal.css";
import { useAsyncError } from "react-router-dom";

function TaskModal({ isOpen, onClose, onSave }) {

  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")

  if (isOpen === false) {
    return null;
  }
  
  return (
    <div className="modal-container">
      <div className="header">
        <h1>Add Event </h1>
        <button
          className="close-button"
          onClick={() => onClose()}
        >

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>

        </button>
      </div>

      <div className="body">
        <input type="text"
               placeholder="Summary"
               value={summary}
               onChange={(e) => setSummary(e.target.value)}
                />
        <input type="text"
               placeholder="Description"
               value={description}
               onChange={(e) => setDescription(e.target.value)} 
               />
        <input type="datetime-local"
               placeholder="Due Date" 
               value={dueDate}
               onChange={(e) => setDueDate(e.target.value)}
               />
        <button
          onClick={() => {
            const newTask = {
              summary,
              description,
              dueDate,
              id: Date.now()
            }

            onSave(newTask)

            setSummary("");
            setDescription("");
            setDueDate("");
            onClose();
            }}>
          Add
        </button>
      </div>

    </div>
  );
}

export default TaskModal;