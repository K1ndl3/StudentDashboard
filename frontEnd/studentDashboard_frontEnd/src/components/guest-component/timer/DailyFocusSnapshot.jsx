import { useEffect, useRef } from "react"
import { getPacificDateTime, saveDailySnapshot } from "./timerStorage"

const CHECK_INTERVAL_MS = 15_000

function DailyFocusSnapshot() {
    const activeDateRef = useRef(getPacificDateTime().dateKey)

    useEffect(() => {
        const checkSnapshotTime = () => {
            const pacificNow = getPacificDateTime()

            if (pacificNow.dateKey !== activeDateRef.current) {
                saveDailySnapshot(activeDateRef.current)
                activeDateRef.current = pacificNow.dateKey
            }

            if (pacificNow.hour === 23 && pacificNow.minute === 59) {
                saveDailySnapshot(pacificNow.dateKey)
            }
        }

        checkSnapshotTime()
        const interval = window.setInterval(checkSnapshotTime, CHECK_INTERVAL_MS)
        return () => window.clearInterval(interval)
    }, [])

    return null
}

export default DailyFocusSnapshot
