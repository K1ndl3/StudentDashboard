import { formatDuration, summarizeTime } from "./timerStorage"

function TimerStats({ categories, timeLog }) {
    const totals = summarizeTime(categories, timeLog)
    const maxSeconds = Math.max(...totals.map(item => item.seconds), 1)
    const grandTotal = totals.reduce((sum, item) => sum + item.seconds, 0)

    return (
        <section className="timer-stats" aria-labelledby="timer-stats-heading">
            <div className="stats-heading">
                <div>
                    <p className="stats-eyebrow">Focus history</p>
                    <h3 id="timer-stats-heading">Hours by category</h3>
                </div>
                <span className="stats-total">{formatDuration(grandTotal)} total</span>
            </div>

            {grandTotal === 0 ? (
                <div className="stats-empty">
                    <span aria-hidden="true">◫</span>
                    <strong>No completed sessions yet</strong>
                    <p>Finish a work cycle to add time to this chart.</p>
                </div>
            ) : (
                <div className="histogram" role="img" aria-label="Time worked in each category">
                    {totals.map(({ category, seconds }) => (
                        <div className="histogram-row" key={category}>
                            <div className="histogram-label">
                                <span title={category}>{category}</span>
                                <strong>{formatDuration(seconds)}</strong>
                            </div>
                            <div className="histogram-track">
                                <div
                                    className="histogram-bar"
                                    style={{ width: `${(seconds / maxSeconds) * 100}%` }}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    )
}

export default TimerStats
