import "../event/Event.css"

function Event({ id, summary, description, dueDate, onDelete, onAddToTaskList }) {
    const dateObj = dueDate != null ? new Date(dueDate) : null;
    const formatTime =
        dateObj && !Number.isNaN(dateObj.getTime())
            ? dateObj.toLocaleString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
              })
            : "—";

    return (
        <div className="event-container">
            <div className="event-detail">
                <h1 className="summary">{summary}</h1>
                <p className="time">Due: {formatTime}</p>
            </div>
            {onAddToTaskList || onDelete ? (
                <div className="event-actions">
                    {onAddToTaskList ? (
                        <button
                            type="button"
                            className="add-task-button"
                            aria-label="Add event to task list"
                            title="Add to task list"
                            onClick={() => onAddToTaskList()}
                        >
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
                                    d="M12 4.5v15m7.5-7.5h-15"
                                />
                            </svg>
                        </button>
                    ) : null}
                    {onDelete ? (
                        <button
                            type="button"
                            className="delete-button"
                            aria-label="Delete event"
                            title="Delete"
                            onClick={() => onDelete(id)}
                        >
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
                                    d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                                />
                            </svg>
                        </button>
                    ) : null}
                </div>
            ) : null}
        </div>
    );
}

export default Event