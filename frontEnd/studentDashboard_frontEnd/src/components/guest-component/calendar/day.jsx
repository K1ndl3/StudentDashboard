import "./day.css";

const MAX_PILLS = 2;

function fmtTime(t) {
    if (!t) return "";
    // t is HH:MM
    const [hStr, mStr] = t.split(":");
    const h = parseInt(hStr, 10);
    const m = mStr ?? "00";
    const suffix = h >= 12 ? "pm" : "am";
    const h12 = h % 12 || 12;
    return `${h12}:${m}${suffix}`;
}

function Day({ day, isoDate, events = [], snapshot, isCurrentMonth, isToday, isSelected, onClick, onSnapshotClick }) {
    const hasEvents = events.length > 0;
    const hasSnapshot = Boolean(snapshot);
    const pillEvents = events.slice(0, MAX_PILLS);
    const overflow = events.length - MAX_PILLS;

    const cls = [
        "cal-day",
        isCurrentMonth ? "" : "other-month",
        isToday ? "is-today" : "",
        isSelected ? "is-selected" : "",
        !isCurrentMonth ? "" : hasEvents ? "has-events" : "",
        hasSnapshot ? "has-focus-snapshot" : "",
    ].filter(Boolean).join(" ");

    return (
        <div className={cls}>
            <button
                type="button"
                className="cal-day-hitbox"
                onClick={() => isoDate && onClick(isoDate)}
                aria-label={isoDate ? `${isoDate}${hasEvents ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ""}` : undefined}
            />
            {/* Day number */}
            <div className={`cal-day-number${isToday ? " today-circle" : ""}`}>
                {day}
            </div>

            {hasSnapshot && (
                <button
                    type="button"
                    className="focus-snapshot-button"
                    onClick={() => onSnapshotClick(snapshot)}
                    aria-label={`View focus graph for ${isoDate}`}
                    title="View daily focus graph"
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 19V5m0 14h16M7 15l4-4 3 2 5-6m0 0h-4m4 0v4" />
                    </svg>
                </button>
            )}

            {/* Event pills */}
            {isCurrentMonth && (
                <div className="cal-event-pills">
                    {pillEvents.map((ev) => (
                        <div key={ev.id} className="cal-event-pill" title={`${fmtTime(ev.currtime)} ${ev.details}`}>
                            {ev.currtime && (
                                <span className="pill-time">{fmtTime(ev.currtime)}</span>
                            )}
                            <span className="pill-title">{ev.details}</span>
                        </div>
                    ))}
                    {overflow > 0 && (
                        <div className="cal-event-overflow">+{overflow} more</div>
                    )}
                </div>
            )}
        </div>
    );
}

export default Day;
