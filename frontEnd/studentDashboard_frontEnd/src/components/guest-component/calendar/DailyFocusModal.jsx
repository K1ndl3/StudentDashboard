import { useEffect } from "react"
import { formatDuration } from "../timer/timerStorage"
import "./daily-focus-modal.css"

function formatSnapshotDate(dateKey) {
    const [year, month, day] = dateKey.split("-").map(Number)
    return new Date(year, month - 1, day).toLocaleDateString(undefined, {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
    })
}

function DailyFocusModal({ snapshot, onClose }) {
    const maxSeconds = Math.max(...snapshot.totals.map(item => item.seconds), 1)

    useEffect(() => {
        const handleKeyDown = event => {
            if (event.key === "Escape") onClose()
        }

        document.body.classList.add("focus-snapshot-modal-open")
        window.addEventListener("keydown", handleKeyDown)
        return () => {
            document.body.classList.remove("focus-snapshot-modal-open")
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [onClose])

    return (
        <div className="focus-snapshot-overlay" onClick={onClose}>
            <section
                className="focus-snapshot-modal"
                onClick={event => event.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="focus-snapshot-title"
            >
                <header className="focus-snapshot-header">
                    <div>
                        <span className="focus-snapshot-label">Daily focus snapshot</span>
                        <h2 id="focus-snapshot-title">{formatSnapshotDate(snapshot.date)}</h2>
                        <p>Saved at the end of the day in Pacific Time.</p>
                    </div>
                    <button type="button" onClick={onClose} aria-label="Close focus graph">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
                            <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                        </svg>
                    </button>
                </header>

                <div className="focus-snapshot-content">
                    <div className="focus-snapshot-total">
                        <span>Total focused time</span>
                        <strong>{formatDuration(snapshot.totalSeconds)}</strong>
                    </div>
                    <div className="focus-snapshot-chart">
                        {snapshot.totals.map(({ category, seconds }) => (
                            <div className="focus-snapshot-row" key={category}>
                                <div>
                                    <span>{category}</span>
                                    <strong>{formatDuration(seconds)}</strong>
                                </div>
                                <div className="focus-snapshot-track">
                                    <span style={{ width: `${(seconds / maxSeconds) * 100}%` }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

export default DailyFocusModal
