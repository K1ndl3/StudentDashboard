import { useState, useEffect } from "react"
import "./task-list.css"

function TaskList() {
    const [list, setList] = useState(() => {
        try {
            const raw = localStorage.getItem("taskList")
            return raw ? JSON.parse(raw) : [
                { id: 1, text: "Enter a Task", completed: false },
            ]
        } catch (e) { return [] }
    })
    const [newTask, setNewTask] = useState("")

    useEffect(() => {
        localStorage.setItem("taskList", JSON.stringify(list))
    }, [list])

    const addTask = () => {
        const trimmed = newTask.trim()
        if (!trimmed) return
        setList(prev => [{ id: Date.now(), text: trimmed, completed: false }, ...prev])
        setNewTask("")
    }

    const deleteTask = (id) => setList(prev => prev.filter(t => t.id !== id))

    const toggleComplete = (id) => setList(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t))

    const startEdit = (id) => setList(prev => prev.map(t => t.id === id ? { ...t, editing: true, editText: t.text } : t))
    const cancelEdit = (id) => setList(prev => prev.map(t => t.id === id ? (() => { const { editing, editText, ...rest } = t; return rest })() : t))
    const changeEditText = (id, value) => setList(prev => prev.map(t => t.id === id ? { ...t, editText: value } : t))
    const saveEdit = (id) => setList(prev => prev.map(t => t.id === id ? { id: t.id, text: (t.editText||"").trim() || t.text, completed: t.completed } : t))

    const onKeyAdd = (e) => { if (e.key === "Enter") addTask() }

    return (
        <div className="tasklist-container">
            <h1>Task List</h1>

            <div className="task-input-row">
                <input
                    className="task-input"
                    type="text"
                    placeholder="Enter new task"
                    value={newTask}
                    onChange={e => setNewTask(e.target.value)}
                    onKeyDown={onKeyAdd}
                />
                <button className="add-button" onClick={addTask}>Add</button>
            </div>

            <ul className="task-list">
                {list.map((task) => (
                    <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                        {task.editing ? (
                            <>
                                <input className="edit-input" value={task.editText} onChange={(e) => changeEditText(task.id, e.target.value)} />
                                <div className="controls">
                                    <button className="save-button" onClick={() => saveEdit(task.id)}>Save</button>
                                    <button className="cancel-button" onClick={() => cancelEdit(task.id)}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <span className="task-text" onClick={() => toggleComplete(task.id)}>{task.text}</span>
                                <div className="controls">
                                    <button className="edit-button" onClick={() => startEdit(task.id)}>Edit</button>
                                    <button className="delete-button" onClick={() => deleteTask(task.id)}>Delete</button>
                                </div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default TaskList