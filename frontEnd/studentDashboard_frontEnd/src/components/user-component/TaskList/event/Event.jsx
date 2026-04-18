import "../event/Event.css"

function Event({id,summary, description, dueDate, onDelete}) {

    const dateObj = new Date(dueDate)

    const formatTime = dateObj.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',  
        hour: 'numeric', 
        minute: '2-digit',
        hour12: true
    });

    return (
        <div className="event-container">
            <div className="event-detail">
                <h1 className="summary">{summary}</h1>
                <p className="time">Due: {formatTime}</p>
            </div>
            <button className="delete-button"
                    onClick={() => onDelete(id)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                Del
            </button>
        </div>
    )
}

export default Event