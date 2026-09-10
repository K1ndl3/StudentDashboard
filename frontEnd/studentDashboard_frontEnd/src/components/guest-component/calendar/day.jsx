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

function Day({ day, isoDate, events = [], isCurrentMonth, isToday, isSelected, onClick }) {
    const hasEvents = events.length > 0;
    const pillEvents = events.slice(0, MAX_PILLS);
    const overflow = events.length - MAX_PILLS;

    const cls = [
        "cal-day",
        isCurrentMonth ? "" : "other-month",
        isToday ? "is-today" : "",
        isSelected ? "is-selected" : "",
        !isCurrentMonth ? "" : hasEvents ? "has-events" : "",
    ].filter(Boolean).join(" ");

    return (
        <div
            className={cls}
            onClick={() => isoDate && onClick(isoDate)}
            role="button"
            tabIndex={isoDate ? 0 : -1}
            aria-label={isoDate ? `${isoDate}${hasEvents ? `, ${events.length} event${events.length > 1 ? "s" : ""}` : ""}` : undefined}
            onKeyDown={(e) => {
                if ((e.key === "Enter" || e.key === " ") && isoDate) {
                    e.preventDefault();
                    onClick(isoDate);
                }
            }}
        >
            {/* Day number */}
            <div className={`cal-day-number${isToday ? " today-circle" : ""}`}>
                {day}
            </div>

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
