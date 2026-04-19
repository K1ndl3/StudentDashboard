// TaskModal.js
import { useEffect, useState } from "react";
import "./TaskModal.css";

function TaskModal({ isOpen, onClose, onSave }) {

  const [summary, setSummary] = useState("")
  const [description, setDescription] = useState("")
  const [dueDate, setDueDate] = useState("")

  useEffect(() => {
    if (!isOpen) return;

    document.documentElement.classList.add("task-modal-open");
    document.body.classList.add("task-modal-open");

    return () => {
      document.documentElement.classList.remove("task-modal-open");
      document.body.classList.remove("task-modal-open");
    };
  }, [isOpen]);

  if (isOpen === false) {
    return null;
  }
  
  return (
    <div className="modal-container">
      <div className="header">
        <h1 className="modal-title">Add Event</h1>
        <button
          className="close-button"
          type="button"
          aria-label="Close"
          onClick={() => onClose()}
        >

          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
          </svg>

        </button>
      </div>

      <div className="body">
        <input
          className="input-link"
          type="text"
          placeholder="Summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
        />
        <input
          className="input-link"
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          className="input-link"
          type="datetime-local"
          placeholder="Due Date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
        <button
          className="add-button"
          type="button"
          aria-label="Add task"
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
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
        </button>
      </div>

    </div>
  );
}

export default TaskModal;