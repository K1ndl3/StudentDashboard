import { useEffect, useRef } from "react"
import { getPacificDateTime, saveDailySnapshot } from "./timerStorage"

const CHECK_INTERVAL_MS = 15_000

function DailyFocusSnapshot() {
    const activeDateRef = useRef(getPacificDateTime().dateKey)
    const savedDatesRef = useRef(new Set())

    useEffect(() => {
        const saveOnce = dateKey => {
            if (savedDatesRef.current.has(dateKey)) return
            saveDailySnapshot(dateKey)
            savedDatesRef.current.add(dateKey)
        }

        const checkSnapshotTime = () => {
            const pacificNow = getPacificDateTime()

            if (pacificNow.dateKey !== activeDateRef.current) {
                saveOnce(activeDateRef.current)
                activeDateRef.current = pacificNow.dateKey
            }

            if (pacificNow.hour === 23 && pacificNow.minute === 59) {
                saveOnce(pacificNow.dateKey)
            }
        }

        checkSnapshotTime()
        const interval = window.setInterval(checkSnapshotTime, CHECK_INTERVAL_MS)
        return () => window.clearInterval(interval)
    }, [])

    return null
}

export default DailyFocusSnapshot
