export const DEFAULT_CATEGORIES = ["Study", "Work", "Self-study"]
export const CATEGORY_STORAGE_KEY = "pom_categories"
export const TIME_LOG_STORAGE_KEY = "pom_category_time"
export const DAILY_SNAPSHOTS_STORAGE_KEY = "pom_daily_focus_snapshots"
export const DAILY_SNAPSHOT_EVENT = "pom-daily-snapshot-saved"
const PACIFIC_TIME_ZONE = "America/Los_Angeles"

function readJson(key, fallback) {
    try {
        const value = JSON.parse(localStorage.getItem(key) ?? "null")
        return value ?? fallback
    } catch {
        return fallback
    }
}

export function loadCategories() {
    const saved = readJson(CATEGORY_STORAGE_KEY, [])
    if (!Array.isArray(saved)) return DEFAULT_CATEGORIES

    const unique = [...new Set([...DEFAULT_CATEGORIES, ...saved]
        .filter(category => typeof category === "string")
        .map(category => category.trim())
        .filter(Boolean))]

    return unique
}

export function loadTimeLog() {
    const saved = readJson(TIME_LOG_STORAGE_KEY, [])
    if (!Array.isArray(saved)) return []

    return saved.filter(entry =>
        typeof entry?.category === "string" &&
        Number.isFinite(entry?.seconds) &&
        entry.seconds > 0 &&
        typeof entry?.completedAt === "string" &&
        Number.isFinite(new Date(entry.completedAt).getTime())
    )
}

export function summarizeTime(categories, timeLog) {
    const totals = Object.fromEntries(categories.map(category => [category, 0]))

    timeLog.forEach(({ category, seconds }) => {
        totals[category] = (totals[category] ?? 0) + seconds
    })

    return Object.entries(totals)
        .map(([category, seconds]) => ({ category, seconds }))
        .sort((a, b) => b.seconds - a.seconds)
}

export function formatDuration(seconds) {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.round(seconds / 60)}m`

    const hours = seconds / 3600
    return `${hours >= 10 ? hours.toFixed(0) : hours.toFixed(1)}h`
}

export function getPacificDateTime(date = new Date()) {
    const parts = new Intl.DateTimeFormat("en-US", {
        timeZone: PACIFIC_TIME_ZONE,
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hourCycle: "h23",
    }).formatToParts(date)
    const values = Object.fromEntries(parts.map(part => [part.type, part.value]))

    return {
        dateKey: `${values.year}-${values.month}-${values.day}`,
        hour: Number(values.hour),
        minute: Number(values.minute),
    }
}

export function loadDailySnapshots() {
    const saved = readJson(DAILY_SNAPSHOTS_STORAGE_KEY, {})
    return saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {}
}

export function saveDailySnapshot(dateKey) {
    const categories = loadCategories()
    const dailyLog = loadTimeLog().filter(entry =>
        getPacificDateTime(new Date(entry.completedAt)).dateKey === dateKey
    )
    const totals = summarizeTime(categories, dailyLog)
    const snapshot = {
        date: dateKey,
        savedAt: new Date().toISOString(),
        totalSeconds: totals.reduce((sum, item) => sum + item.seconds, 0),
        totals,
    }
    const snapshots = { ...loadDailySnapshots(), [dateKey]: snapshot }

    localStorage.setItem(DAILY_SNAPSHOTS_STORAGE_KEY, JSON.stringify(snapshots))
    window.dispatchEvent(new CustomEvent(DAILY_SNAPSHOT_EVENT, { detail: snapshot }))
    return snapshot
}
