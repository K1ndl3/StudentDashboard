import { useEffect, useState } from "react"
import "./date-popup.css"


function DatePopup({isoDate, onClose}) {

    const [events, setEvent] = useState([])
    const [detail, setDetail] = useState("")
    const [time, setTime] = useState("")

    useEffect(() => {
        const stored = JSON.parse(localStorage.getItem(isoDate)) || []
        setEvent(stored)
    },[isoDate])

    const handleAddEvents = () => {
        if (!detail.trim()) return
        const now = new Date();
        const newEvent = {
            id: crypto.randomUUID(),
            details: detail,
            currtime: time
        }

        const newArr = [...events, newEvent]
        newArr.sort((a, b) => new Date(a.currtime) - new Date(b.currtime));
        setEvent(newArr)
        localStorage.setItem(isoDate, JSON.stringify(newArr))
        setDetail("")
        setTime("")
    }

    return (
        <div className="popup-container">
            <div className="popup-header">
                <h2>{isoDate}</h2>
                <button
                    className="popup-button"
                    onClick={onClose}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>

                </button>
            </div>
            <div className="event-container">
                <div className="input-field">
                    <input type="text" 
                           placeholder="enter details"
                           value={detail}
                           onChange={e => setDetail(e.target.value)}/>
                    <input type="time"
                           placeholder="enter time"
                           value={time} 
                           onChange={e => setTime(e.target.value)}/>
                    <button
                        onClick={handleAddEvents}
                        >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                        </svg>
                    </button>
                </div>
                <div className="event-list">
                        {events.map((evnt, evnt_index) => (
                            <li key={evnt.id} className="event-item">
                                    <span className="event-data">
                                        <h2 className="event-detail">{evnt.details}</h2>
                                        <p className="event-time">
                                           starts at: {evnt.currtime ? evnt.currtime : "invalid time"}
                                        </p>
                                    </span>
                                    <span className="event-button">
                                        <button className="delete-button">
                                            delete
                                        </button>
                                        <button className="edit-button">
                                            edit
                                        </button>
                                    </span>
                            </li>
                        ))}
                </div>
            </div>
        </div>
    )
}

export default DatePopup