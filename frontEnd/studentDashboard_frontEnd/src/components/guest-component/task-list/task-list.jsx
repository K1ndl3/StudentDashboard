import { useState, useEffect, useRef } from "react"
import "./task-list.css"

/* ─── Schema helpers ─────────────────────────────────────────────── */
function normalizeTask(raw) {
    return {
        id: raw.id ?? Date.now(),
        text: raw.text ?? raw.title ?? raw.summary ?? "",
        completed: raw.completed ?? false,
        type: raw.type ?? "checkbox",       // "checkbox" | "progress"
        priority: raw.priority ?? null,     // null | "low" | "medium" | "high"
        dueDate: raw.dueDate ?? null,
        description: raw.description ?? "",
        completedUnits: raw.completedUnits ?? 0,
        totalUnits: raw.totalUnits ?? 10,
        unitLabel: raw.unitLabel ?? "units",
        subtasks: (raw.subtasks ?? []).map(st => ({
            id: st.id ?? Date.now() + Math.random(),
            text: st.text ?? "",
            completed: st.completed ?? false,
        })),
        expanded: false, // never persisted
    };
}

/* ─── Date helpers ───────────────────────────────────────────────── */
const todayISO = () => new Date().toISOString().slice(0, 10);

function isOverdue(dueDate) {
    if (!dueDate) return false;
    return dueDate < todayISO();
}

function isToday(dueDate) {
    return dueDate === todayISO();
}

function fmtDue(dueDate) {
    if (!dueDate) return "";
    const [, m, d] = dueDate.split("-");
    return `${m}/${d}`;
}

/* ─── Checklist icon ─────────────────────────────────────────────── */
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={3} stroke="currentColor" width="10" height="10">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
    </svg>
);

const UpdateIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={2} stroke="currentColor" width="16" height="16" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992V4.356m-.134 4.992a9 9 0 0 0-15.659-2.91m-.134 8.214H.096v4.992m.134-4.992a9 9 0 0 0 15.659 2.91" />
    </svg>
);

const SubtaskIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
        strokeWidth={2} stroke="currentColor" width="16" height="16" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 5v7a3 3 0 0 0 3 3h13m0 0-4-4m4 4-4 4" />
    </svg>
);

/* ─── Individual task row ────────────────────────────────────────── */
function TaskItem({ task, isSelected, dropPosition, onSelect, onToggle, onDelete, onToggleExpand, onUpdateProgress, onAddSubtask, onToggleSubtask, onDeleteSubtask, onDragStart, onDragOver, onDrop, onDragEnd, canReorder }) {
    const [subtaskInput, setSubtaskInput] = useState("");
    const [progressInput, setProgressInput] = useState(task.completedUnits);
    const itemRef = useRef(null);

    useEffect(() => {
        if (!task.expanded) return;
        itemRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }, [task.expanded]);

    const displayedUnits = isSelected
        ? Math.max(0, Math.min(Number(progressInput) || 0, task.totalUnits))
        : task.completedUnits;
    const subtasksDone = task.subtasks.filter(st => st.completed).length;
    const progressPct = task.totalUnits > 0
        ? Math.round((displayedUnits / task.totalUnits) * 100)
        : 0;

    const dueCls = isOverdue(task.dueDate) ? "due-overdue"
        : isToday(task.dueDate) ? "due-today"
            : "";

    const handleAddSubtask = () => {
        const trimmed = subtaskInput.trim();
        if (!trimmed) return;
        onAddSubtask(task.id, trimmed);
        setSubtaskInput("");
    };

    const handleUpdateProgress = () => {
        onUpdateProgress(task.id, progressInput);
    };

    const handleProgressKeyDown = (event) => {
        if (!isSelected || task.type !== "progress") return;
        if (event.key === "ArrowUp" || event.key === "ArrowDown") {
            event.preventDefault();
            setProgressInput((current) => Math.max(
                0,
                Math.min(Number(current) + (event.key === "ArrowUp" ? 1 : -1), task.totalUnits)
            ));
        } else if (event.key === "Enter") {
            event.preventDefault();
            handleUpdateProgress();
        }
    };

    return (
        <li
            ref={itemRef}
            className={`task-item${task.completed ? " completed" : ""}${task.expanded ? " expanded" : ""}${isSelected ? " progress-selected" : ""}${dropPosition ? ` drop-${dropPosition}` : ""}`}
            draggable={canReorder}
            onDragStart={(event) => onDragStart(task.id, event)}
            onDragOver={(event) => onDragOver(task.id, event)}
            onDrop={(event) => onDrop(task.id, event)}
            onDragEnd={onDragEnd}
        >
            {/* ── Compact row ── */}
            <div
                className={`task-row${task.type === "progress" ? " progress-task-row" : ""}`}
                onClick={() => task.type === "progress" && onSelect(task.id)}
                onKeyDown={handleProgressKeyDown}
                tabIndex={task.type === "progress" ? 0 : undefined}
                role={task.type === "progress" ? "button" : undefined}
                aria-label={task.type === "progress" ? `${task.text}. Use up and down arrow keys to change progress, then Enter to save.` : undefined}
            >
                {canReorder && <span className="task-drag-handle" aria-label="Drag to reorder task">⠿</span>}
                <button
                    className="expand-btn"
                    onClick={(event) => {
                        event.stopPropagation();
                        onToggleExpand(task.id);
                    }}
                    aria-label={task.expanded ? "Collapse" : "Expand"}
                    aria-expanded={task.expanded}
                    title={task.expanded ? "Hide task details" : "Edit task details, subtasks, or progress"}
                >
                    <span aria-hidden="true">{task.expanded ? "⌄" : "›"}</span>
                </button>

                {/* Completion control */}
                {task.type === "progress" ? (
                    <span className="progress-badge-inline">
                        {displayedUnits}/{task.totalUnits}
                    </span>
                ) : (
                    <button
                        className={`checkbox-btn${task.completed ? " checked" : ""}`}
                        onClick={(event) => {
                            event.stopPropagation();
                            onToggle(task.id);
                        }}
                        aria-label={task.completed ? "Mark incomplete" : "Mark complete"}
                    >
                        {task.completed && <CheckIcon />}
                    </button>
                )}

                <span className="task-text">{task.text}</span>

                {/* Badges */}
                {task.priority && (
                    <span className={`priority-badge priority-${task.priority}`}>
                        {task.priority}
                    </span>
                )}
                {task.dueDate && (
                    <span className={`due-badge${dueCls ? ` ${dueCls}` : ""}`}>
                        {fmtDue(task.dueDate)}
                    </span>
                )}
                {task.subtasks.length > 0 && (
                    <span className="subtask-count-badge">
                        {subtasksDone}/{task.subtasks.length}
                    </span>
                )}

                <button
                    className="task-delete-btn"
                    onClick={(event) => {
                        event.stopPropagation();
                        onDelete(task.id);
                    }}
                    aria-label="Delete task"
                    title="Delete"
                >
                    ×
                </button>
            </div>

            {/* Progress bar for progress-type tasks */}
            {task.type === "progress" && (
                <div className="task-progress-track">
                    <div
                        className="task-progress-fill"
                        style={{ width: `${progressPct}%` }}
                    />
                </div>
            )}

            {/* Subtasks are always nested directly below their parent task. */}
            {task.subtasks.length > 0 && (
                <ul className="subtask-list">
                    {task.subtasks.map(st => (
                        <li
                            key={st.id}
                            className={`subtask-item${st.completed ? " completed" : ""}`}
                        >
                            <span className="subtask-arrow"><SubtaskIcon /></span>
                            <button
                                className={`checkbox-btn sm${st.completed ? " checked" : ""}`}
                                onClick={() => onToggleSubtask(task.id, st.id)}
                                aria-label={st.completed ? "Uncheck subtask" : "Check subtask"}
                            >
                                {st.completed && <CheckIcon />}
                            </button>
                            <span className="subtask-text">{st.text}</span>
                            <button
                                className="subtask-delete"
                                onClick={() => onDeleteSubtask(task.id, st.id)}
                                aria-label="Delete subtask"
                            >
                                ×
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            {/* ── Expanded detail ── */}
            {task.expanded && (
                <div className="task-detail">
                    {/* Progress editor */}
                    {task.type === "progress" && (
                        <div className="detail-section">
                            <span className="detail-label">Progress</span>
                            <div className="progress-input-row">
                                <input
                                    type="number"
                                    min="0"
                                    max={task.totalUnits}
                                    value={progressInput}
                                    onChange={e => setProgressInput(e.target.value)}
                                    onKeyDown={e => {
                                        if (e.key === "Enter") handleUpdateProgress();
                                    }}
                                    className="progress-num-input"
                                    aria-label="Completed units"
                                />
                                <span className="progress-of-label">
                                    of {task.totalUnits} {task.unitLabel} — {progressPct}%
                                </span>
                                <button
                                    type="button"
                                    className="progress-update-btn"
                                    onClick={handleUpdateProgress}
                                    aria-label="Update progress"
                                    title="Update progress"
                                >
                                    <UpdateIcon />
                                </button>
                            </div>
                            {task.type === "progress" && (
                                <button
                                    className="progress-done-btn"
                                    onClick={() => onToggle(task.id)}
                                >
                                    {task.completed ? "Mark incomplete" : "Mark complete"}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {task.description && (
                        <div className="detail-section detail-description">
                            <span className="detail-label">Notes</span>
                            <p className="task-description-text">{task.description}</p>
                        </div>
                    )}

                    {/* Due date detail */}
                    {task.dueDate && (
                        <div className="detail-section">
                            <span className="detail-label">Due</span>
                            <span className={`detail-due${dueCls ? ` ${dueCls}` : ""}`}>{task.dueDate}</span>
                        </div>
                    )}

                    {/* Subtasks */}
                    <div className="detail-section subtasks-section">
                        <div className="subtasks-header">
                            <span className="detail-label">
                                Subtasks
                            </span>
                            {task.subtasks.length > 0 && (
                                <span className="subtasks-progress-label">
                                    {subtasksDone} / {task.subtasks.length} done
                                </span>
                            )}
                        </div>

                        <div className="add-subtask-row">
                            <input
                                type="text"
                                className="subtask-input"
                                placeholder="Add a subtask…"
                                value={subtaskInput}
                                onChange={e => setSubtaskInput(e.target.value)}
                                onKeyDown={e => e.key === "Enter" && handleAddSubtask()}
                            />
                            <button
                                className="add-subtask-btn"
                                onClick={handleAddSubtask}
                                disabled={!subtaskInput.trim()}
                                aria-label="Add subtask"
                            >
                                +
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </li>
    );
}

/* ─── Add task form ─────────────────────────────────────────────── */
function AddTaskForm({ onAdd, onCancel }) {
    const [title, setTitle] = useState("");
    const [type, setType] = useState("checkbox");
    const [priority, setPriority] = useState("");
    const [dueDate, setDueDate] = useState("");
    const [description, setDescription] = useState("");
    const [totalUnits, setTotalUnits] = useState(10);
    const [unitLabel, setUnitLabel] = useState("units");

    const submit = () => {
        const trimmed = title.trim();
        if (!trimmed) return;
        onAdd({
            text: trimmed,
            type,
            priority: priority || null,
            dueDate: dueDate || null,
            description,
            totalUnits: type === "progress" ? (Number(totalUnits) || 10) : 10,
            unitLabel: type === "progress" ? (unitLabel || "units") : "units",
        });
    };

    return (
        <div className="add-task-form">
            <input
                className="form-input"
                type="text"
                placeholder="Task title (required)"
                value={title}
                onChange={e => setTitle(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submit()}
                autoFocus
            />

            <div className="form-row">
                <div className="form-field">
                    <span className="form-label">Type</span>
                    <div className="type-toggle">
                        <button
                            type="button"
                            className={`type-btn${type === "checkbox" ? " active" : ""}`}
                            onClick={() => setType("checkbox")}
                        >
                            ✓ Checklist
                        </button>
                        <button
                            type="button"
                            className={`type-btn${type === "progress" ? " active" : ""}`}
                            onClick={() => setType("progress")}
                        >
                            ◎ Progress
                        </button>
                    </div>
                </div>

                <div className="form-field">
                    <span className="form-label">Priority</span>
                    <select
                        className="form-select"
                        value={priority}
                        onChange={e => setPriority(e.target.value)}
                    >
                        <option value="">None</option>
                        <option value="high">High</option>
                        <option value="medium">Medium</option>
                        <option value="low">Low</option>
                    </select>
                </div>

                <div className="form-field">
                    <span className="form-label">Due</span>
                    <input
                        type="date"
                        className="form-input date-input"
                        value={dueDate}
                        onChange={e => setDueDate(e.target.value)}
                    />
                </div>
            </div>

            {type === "progress" && (
                <div className="form-row">
                    <div className="form-field">
                        <span className="form-label">Total</span>
                        <input
                            type="number"
                            min="1"
                            className="form-input number-input"
                            value={totalUnits}
                            onChange={e => setTotalUnits(e.target.value)}
                        />
                    </div>
                    <div className="form-field flex-grow">
                        <span className="form-label">Unit label</span>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="pages, items, hrs…"
                            value={unitLabel}
                            onChange={e => setUnitLabel(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <textarea
                className="form-input form-textarea"
                placeholder="Description / notes (optional)"
                value={description}
                onChange={e => setDescription(e.target.value)}
                rows={2}
            />

            <div className="form-actions">
                <button
                    className="btn-add-submit"
                    onClick={submit}
                    disabled={!title.trim()}
                >
                    Add Task
                </button>
                <button className="btn-cancel" onClick={onCancel}>
                    Cancel
                </button>
            </div>
        </div>
    );
}

/* ─── Main task list ─────────────────────────────────────────────── */
function TaskList({ hideHeader = false, remoteTasks, onTasksChange, onTaskDelete }) {
    const usesRemoteTasks = Array.isArray(remoteTasks);
    const [tasks, setTasks] = useState(() => {
        if (usesRemoteTasks) {
            return remoteTasks.map(normalizeTask);
        }
        try {
            const raw = localStorage.getItem("taskList");
            const parsed = raw ? JSON.parse(raw) : [{ id: 1, text: "Enter a Task", completed: false }];
            return parsed.map(normalizeTask);
        } catch {
            return [];
        }
    });

    const [showAddForm, setShowAddForm] = useState(false);
    const [filter, setFilter] = useState("all");   // "all" | "active" | "done"
    const [sortBy, setSortBy] = useState("added"); // "added" | "due" | "priority"
    const [draggedTaskId, setDraggedTaskId] = useState(null);
    const [dropTarget, setDropTarget] = useState(null);
    const [selectedProgressTaskId, setSelectedProgressTaskId] = useState(null);

    useEffect(() => {
        if (usesRemoteTasks) {
            setTasks(remoteTasks.map(normalizeTask));
        }
    }, [remoteTasks, usesRemoteTasks]);

    /* ── Persist (exclude runtime-only `expanded`) ── */
    useEffect(() => {
        const toSave = tasks.map(({ expanded, ...rest }) => rest); // eslint-disable-line no-unused-vars
        if (usesRemoteTasks) {
            onTasksChange?.(toSave);
            return;
        }
        localStorage.setItem("taskList", JSON.stringify(toSave));
    }, [tasks, usesRemoteTasks, onTasksChange]);

    /* ── Mutations ── */
    const addTask = (fields) => {
        const newTask = normalizeTask({ id: Date.now(), ...fields });
        setTasks(prev => [newTask, ...prev]);
        setShowAddForm(false);
    };

    const deleteTask = async (id) => {
        if (usesRemoteTasks && onTaskDelete) {
            const deleted = await onTaskDelete(id);
            if (!deleted) return;
        }
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const toggleTask = (id) => setTasks(prev => prev.map(t => {
        if (t.id !== id) return t;
        if (t.type === "progress") {
            const done = !t.completed;
            return { ...t, completed: done, completedUnits: done ? t.totalUnits : 0 };
        }
        if (t.subtasks.length > 0) {
            const done = !t.completed;
            return { ...t, completed: done, subtasks: t.subtasks.map(st => ({ ...st, completed: done })) };
        }
        return { ...t, completed: !t.completed };
    }));

    const toggleExpand = (id) =>
        setTasks(prev => prev.map(t => t.id === id ? { ...t, expanded: !t.expanded } : t));

    const updateProgress = (id, raw) => setTasks(prev => prev.map(t => {
        if (t.id !== id) return t;
        const val = Math.max(0, Math.min(Number(raw) || 0, t.totalUnits));
        return { ...t, completedUnits: val, completed: val >= t.totalUnits };
    }));

    const reorderTasks = (sourceId, targetId, position) => {
        if (sourceId === targetId) return;
        setTasks(prev => {
            const sourceIndex = prev.findIndex(t => t.id === sourceId);
            const targetIndex = prev.findIndex(t => t.id === targetId);
            if (sourceIndex < 0 || targetIndex < 0) return prev;
            const next = [...prev];
            const [source] = next.splice(sourceIndex, 1);
            const nextTargetIndex = next.findIndex(t => t.id === targetId);
            next.splice(nextTargetIndex + (position === "after" ? 1 : 0), 0, source);
            return next;
        });
    };

    const addSubtask = (taskId, text) => setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        const sub = { id: Date.now(), text, completed: false };
        const subs = [...t.subtasks, sub];
        const allDone = subs.every(s => s.completed);
        return { ...t, subtasks: subs, completed: allDone };
    }));

    const toggleSubtask = (taskId, subId) => setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        const subs = t.subtasks.map(st => st.id === subId ? { ...st, completed: !st.completed } : st);
        const allDone = subs.length > 0 && subs.every(s => s.completed);
        return { ...t, subtasks: subs, completed: allDone };
    }));

    const deleteSubtask = (taskId, subId) => setTasks(prev => prev.map(t => {
        if (t.id !== taskId) return t;
        const subs = t.subtasks.filter(st => st.id !== subId);
        const allDone = subs.length > 0 && subs.every(s => s.completed);
        return { ...t, subtasks: subs, completed: subs.length === 0 ? t.completed : allDone };
    }));

    /* ── Filter + sort ── */
    const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

    const visible = [...tasks]
        .filter(t => {
            if (filter === "active") return !t.completed;
            if (filter === "done") return t.completed;
            return true;
        })
        .sort((a, b) => {
            if (sortBy === "priority") {
                const pa = PRIORITY_RANK[a.priority] ?? 3;
                const pb = PRIORITY_RANK[b.priority] ?? 3;
                return pa - pb;
            }
            if (sortBy === "due") {
                if (!a.dueDate && !b.dueDate) return b.id - a.id;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate.localeCompare(b.dueDate);
            }
            return 0; // "added" — preserves the manually arranged order
        });

    const doneCount = tasks.filter(t => t.completed).length;
    const canReorder = filter === "all" && sortBy === "added";

    return (
        <div className="tasklist-container">
            {!hideHeader && <h1 className="tasklist-heading">Task List</h1>}

            {/* ── Controls bar ── */}
            <div className="task-controls">
                <div className="filter-group">
                    {["all", "active", "done"].map(f => (
                        <button
                            key={f}
                            className={`filter-btn${filter === f ? " active" : ""}`}
                            onClick={() => setFilter(f)}
                        >
                            {f === "all" ? `All (${tasks.length})` :
                                f === "active" ? `Active (${tasks.length - doneCount})` :
                                    `Done (${doneCount})`}
                        </button>
                    ))}
                </div>

                <div className="controls-right">
                    <select
                        className="sort-select"
                        value={sortBy}
                        onChange={e => setSortBy(e.target.value)}
                        aria-label="Sort tasks"
                    >
                        <option value="added">By: Added</option>
                        <option value="due">By: Due date</option>
                        <option value="priority">By: Priority</option>
                    </select>

                    <button
                        className="add-task-toggle-btn"
                        onClick={() => setShowAddForm(p => !p)}
                        aria-expanded={showAddForm}
                    >
                        {showAddForm ? "✕ Cancel" : "+ New Task"}
                    </button>
                </div>
            </div>

            {/* ── Add form ── */}
            {showAddForm && (
                <AddTaskForm
                    onAdd={addTask}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* ── Task list ── */}
            <ul className="task-list">
                {visible.length === 0 ? (
                    <li className="task-empty-state">
                        {filter === "all"
                            ? "No tasks yet — click + New Task to start."
                            : `No ${filter} tasks.`}
                    </li>
                ) : visible.map(task => (
                    <TaskItem
                        key={task.id}
                        task={task}
                        isSelected={selectedProgressTaskId === task.id}
                        dropPosition={dropTarget?.id === task.id ? dropTarget.position : null}
                        onSelect={setSelectedProgressTaskId}
                        onToggle={toggleTask}
                        onDelete={deleteTask}
                        onToggleExpand={toggleExpand}
                        onUpdateProgress={updateProgress}
                        onAddSubtask={addSubtask}
                        onToggleSubtask={toggleSubtask}
                        onDeleteSubtask={deleteSubtask}
                        canReorder={canReorder}
                        onDragStart={(id, event) => {
                            setDraggedTaskId(id);
                            setDropTarget(null);
                            event.dataTransfer.effectAllowed = "move";
                            event.dataTransfer.setData("text/plain", String(id));
                        }}
                        onDragOver={(id, event) => {
                            if (id === draggedTaskId) return;
                            event.preventDefault();
                            const bounds = event.currentTarget.getBoundingClientRect();
                            setDropTarget({
                                id,
                                position: event.clientY < bounds.top + bounds.height / 2 ? "before" : "after",
                            });
                        }}
                        onDrop={(id, event) => {
                            event.preventDefault();
                            const bounds = event.currentTarget.getBoundingClientRect();
                            const position = event.clientY < bounds.top + bounds.height / 2 ? "before" : "after";
                            if (draggedTaskId !== null) {
                                reorderTasks(draggedTaskId, id, position);
                            }
                            setDraggedTaskId(null);
                            setDropTarget(null);
                        }}
                        onDragEnd={() => {
                            setDraggedTaskId(null);
                            setDropTarget(null);
                        }}
                    />
                ))}
            </ul>
        </div>
    );
}

export default TaskList;
