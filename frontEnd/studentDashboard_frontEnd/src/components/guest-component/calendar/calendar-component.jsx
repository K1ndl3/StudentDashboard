import { useState, useCallback } from "react";
import "./calendar-component.css";
import Day from "./day.jsx";
import DatePopup from "./date-popup.jsx";

/* ─── Constants ──────────────────────────────────────────────────── */
const MONTH_NAMES = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/* ─── Helpers (pure) ─────────────────────────────────────────────── */
function getDaysInMonth(year, month) {
    return new Date(year, month + 1, 0).getDate();
}

function isoDate(year, month, day) {
    return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function todayISO() {
    const d = new Date();
    return isoDate(d.getFullYear(), d.getMonth(), d.getDate());
}

function getEventsForDate(iso) {
    try {
        return JSON.parse(localStorage.getItem(iso)) || [];
    } catch {
        return [];
    }
}

// refreshKey is accepted so callers can force a re-read by passing a changing value
// eslint-disable-next-line no-unused-vars
function buildCells(viewYear, viewMonth, _refreshKey) {
    const firstDay = new Date(viewYear, viewMonth, 1);
    // Monday = 0 … Sunday = 6
    const firstDayOfWeek = (firstDay.getDay() + 6) % 7;

    const daysInCurrent = getDaysInMonth(viewYear, viewMonth);
    const prevMonth = viewMonth === 0 ? 11 : viewMonth - 1;
    const prevYear  = viewMonth === 0 ? viewYear - 1 : viewYear;
    const daysInPrev = getDaysInMonth(prevYear, prevMonth);
    const nextMonth = viewMonth === 11 ? 0 : viewMonth + 1;
    const nextYear  = viewMonth === 11 ? viewYear + 1 : viewYear;

    const cells = [];

    // Leading cells from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrev - i;
        const iso = isoDate(prevYear, prevMonth, day);
        cells.push({ day, iso, isCurrentMonth: false, events: getEventsForDate(iso) });
    }

    // Current month
    for (let day = 1; day <= daysInCurrent; day++) {
        const iso = isoDate(viewYear, viewMonth, day);
        cells.push({ day, iso, isCurrentMonth: true, events: getEventsForDate(iso) });
    }

    // Trailing cells to fill complete weeks
    const totalCells = Math.ceil(cells.length / 7) * 7;
    let nextDay = 1;
    while (cells.length < totalCells) {
        const iso = isoDate(nextYear, nextMonth, nextDay);
        cells.push({ day: nextDay++, iso, isCurrentMonth: false, events: getEventsForDate(iso) });
    }

    return cells;
}

/* ─── Calendar component ─────────────────────────────────────────── */
function CalendarComponent() {
    const now = new Date();

    const [viewYear, setViewYear]     = useState(now.getFullYear());
    const [viewMonth, setViewMonth]   = useState(now.getMonth());
    const [selectedDate, setSelected] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0); // bumped on popup close

    const today = todayISO();

    // Pass refreshKey to buildCells so state changes trigger a localStorage re-read
    const cells = buildCells(viewYear, viewMonth, refreshKey);

    /* ── Navigation ── */
    const goToPrev = useCallback(() => {
        if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
        else setViewMonth(m => m - 1);
    }, [viewMonth]);

    const goToNext = useCallback(() => {
        if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
        else setViewMonth(m => m + 1);
    }, [viewMonth]);

    const goToToday = useCallback(() => {
        const d = new Date();
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
        setSelected(todayISO());
    }, []);

    const handleDayClick = useCallback((iso) => setSelected(iso), []);

    const handlePopupClose = useCallback(() => {
        setSelected(null);
        setRefreshKey(k => k + 1);
    }, []);

    const isCurrentMonth = viewYear === now.getFullYear() && viewMonth === now.getMonth();

    return (
        <div className="calendar-page">
            <div className="calendar-component-container">

                {/* ── Toolbar ── */}
                <div className="cal-toolbar">
                    <div className="cal-nav-group">
                        <button
                            className="cal-nav-btn"
                            onClick={goToPrev}
                            aria-label="Previous month"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={2.5} stroke="currentColor" width="15" height="15">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                            </svg>
                        </button>
                        <button
                            className="cal-nav-btn"
                            onClick={goToNext}
                            aria-label="Next month"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                strokeWidth={2.5} stroke="currentColor" width="15" height="15">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                            </svg>
                        </button>
                    </div>

                    <h2 className="cal-title">
                        {MONTH_NAMES[viewMonth]} {viewYear}
                    </h2>

                    <button
                        className={`cal-today-btn${isCurrentMonth ? " current" : ""}`}
                        onClick={goToToday}
                    >
                        Today
                    </button>
                </div>

                {/* ── Day-of-week header ── */}
                <div className="cal-dow-header">
                    {DAY_HEADERS.map(d => (
                        <div key={d} className="cal-dow-cell">{d}</div>
                    ))}
                </div>

                {/* ── Grid ── */}
                <div className="cal-grid">
                    {cells.map((cell, idx) => (
                        <Day
                            key={`${cell.iso}-${idx}`}
                            day={cell.day}
                            isoDate={cell.iso}
                            events={cell.events}
                            isCurrentMonth={cell.isCurrentMonth}
                            isToday={cell.iso === today}
                            isSelected={cell.iso === selectedDate}
                            onClick={handleDayClick}
                        />
                    ))}
                </div>
            </div>

            {/* ── Event editor panel ── */}
            {selectedDate && (
                <DatePopup
                    isoDate={selectedDate}
                    onClose={handlePopupClose}
                />
            )}
        </div>
    );
}

export default CalendarComponent;
