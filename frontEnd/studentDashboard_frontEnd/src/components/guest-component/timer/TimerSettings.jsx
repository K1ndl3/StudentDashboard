function TimerSettings({ workMin, breakMin, isUserDashboard, onWorkChange, onBreakChange, onSave, onClose }) {
    return (
        <div className="settings-panel">
            <div className="settings-row">
                <label htmlFor="work-minutes">Work (min)</label>
                <input
                    id="work-minutes"
                    type="number"
                    min="1"
                    value={workMin}
                    onChange={event => onWorkChange(Number(event.target.value))}
                />
            </div>
            <div className="settings-row">
                <label htmlFor="break-minutes">Break (min)</label>
                <input
                    id="break-minutes"
                    type="number"
                    min="1"
                    value={breakMin}
                    onChange={event => onBreakChange(Number(event.target.value))}
                />
            </div>
            <div className="settings-actions">
                <button className="save-button" onClick={onSave}>Save</button>
                {!isUserDashboard && (
                    <button className="cancel-button" onClick={onClose}>Close</button>
                )}
            </div>
        </div>
    )
}

export default TimerSettings
