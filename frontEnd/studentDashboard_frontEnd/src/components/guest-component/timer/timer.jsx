import { useEffect, useRef, useState } from "react"
import alertSound from "../../../assets/alert-444816.mp3"
import "./timer.css"

const THEME = "rgb(100, 60, 255)"
const TIMER_STATE_KEY = "pom_timer_state"

function formatTime(sec) {
    const m = Math.floor(sec / 60).toString().padStart(2, "0")
    const s = Math.floor(sec % 60).toString().padStart(2, "0")
    return `${m}:${s}`
}

function loadTimerState() {
    const workMin = Number(localStorage.getItem("pom_work")) || 25
    const breakMin = Number(localStorage.getItem("pom_break")) || 5
    const cycles = Number(localStorage.getItem("pom_cycles")) || 0

    try {
        const saved = JSON.parse(localStorage.getItem(TIMER_STATE_KEY))
        if (!saved) throw new Error("No saved timer")

        const mode = saved.mode === "break" ? "break" : "work"
        const secondsLeft = Number(saved.secondsLeft)
        const targetTime = Number(saved.targetTime)
        const isRunning = Boolean(saved.isRunning) && Number.isFinite(targetTime)

        return {
            workMin: Number(saved.workMin) || workMin,
            breakMin: Number(saved.breakMin) || breakMin,
            cycles: Number(saved.cycles) || cycles,
            mode,
            isRunning,
            secondsLeft: isRunning
                ? Math.max(0, Math.ceil((targetTime - Date.now()) / 1000))
                : (Number.isFinite(secondsLeft) ? secondsLeft : workMin * 60),
            targetTime: isRunning ? targetTime : null,
        }
    } catch {
        return { workMin, breakMin, cycles, mode: "work", isRunning: false, secondsLeft: workMin * 60, targetTime: null }
    }
}

function Timer({ isUserDashboard = false, accentColor, hideHeader = false }) {
    const ringColor = accentColor || THEME;
    const [savedTimer] = useState(loadTimerState)
    const [workMin, setWorkMin] = useState(savedTimer.workMin)
    const [breakMin, setBreakMin] = useState(savedTimer.breakMin)
    const [mode, setMode] = useState(savedTimer.mode)
    const [isRunning, setIsRunning] = useState(savedTimer.isRunning)
    const [secondsLeft, setSecondsLeft] = useState(savedTimer.secondsLeft)
    const [cycles, setCycles] = useState(savedTimer.cycles)
    const [showSettings, setShowSettings] = useState(false)
    const [audioCount, setAudioCount] = useState(2)
    const audioRef = useRef(new Audio(alertSound))
    const intervalRef = useRef(null)
    const targetRef = useRef(savedTimer.targetTime)

    const playAlert = async () => {
        const audio = audioRef.current
        for (let count = 0; count < audioCount; count++) {
            audio.currentTime = 0;
            await audio.play()
            await new Promise(res => audio.addEventListener("ended", res, { once: true }))
        }
    }

    useEffect(() => { localStorage.setItem("pom_work", workMin) }, [workMin])
    useEffect(() => { localStorage.setItem("pom_break", breakMin) }, [breakMin])
    useEffect(() => { localStorage.setItem("pom_cycles", cycles) }, [cycles])
    useEffect(() => {
        localStorage.setItem(TIMER_STATE_KEY, JSON.stringify({
            workMin, breakMin, mode, isRunning, secondsLeft, cycles,
            targetTime: isRunning ? targetRef.current : null,
        }))
    }, [workMin, breakMin, mode, isRunning, secondsLeft, cycles])

    useEffect(() => { // driver function for the timer using epoch diffs
        if (isRunning) {
            // set target if not present (start or resume)
            if (!targetRef.current) {
                targetRef.current = Date.now() + (secondsLeft * 1000)
            }

            intervalRef.current = setInterval(() => {
                if (!targetRef.current) return
                const remaining = Math.max(0, Math.ceil((targetRef.current - Date.now()) / 1000))
                setSecondsLeft(remaining)
            }, 500)
        }

        return () => clearInterval(intervalRef.current)
    }, [isRunning])
    

    useEffect(() => {
        if (secondsLeft <= 0) {
            playAlert()
            if (mode === "work") {
                setCycles(c => c + 1)
                setMode("break")
                const newSec = breakMin * 60
                setSecondsLeft(newSec)
                if (isRunning) targetRef.current = Date.now() + newSec * 1000
            } else {
                setMode("work")
                const newSec = workMin * 60
                setSecondsLeft(newSec)
                if (isRunning) targetRef.current = Date.now() + newSec * 1000
            }
        }
    }, [secondsLeft, mode, breakMin, workMin])

    const total = mode === "work" ? workMin * 60 : breakMin * 60
    const progress = Math.max(0, Math.min(1, (total - secondsLeft) / total))

    const circumference = 2 * Math.PI * 70 // r=70
    const dash = circumference * progress

    const toggle = () => {
        // if currently running -> pause: save remaining seconds to localStorage and stop the timer
        if (isRunning) {
            targetRef.current = null
            setIsRunning(false)
            return
        }

        // resuming: prefer any paused time from localStorage (replace secondsLeft), then start
        targetRef.current = Date.now() + (secondsLeft * 1000)
        setIsRunning(true)
    }

    const reset = () => { 
        setIsRunning(false); 
        targetRef.current = null; 
        setSecondsLeft(workMin * 60); 
        setMode("work"); 
        setCycles(0) 
    }

    const saveSettings = (w, b) => {
        const wNum = Math.max(1, Math.floor(Number(w) || 25))
        const bNum = Math.max(1, Math.floor(Number(b) || 5))
        setWorkMin(wNum)
        setBreakMin(bNum)
        const nextSeconds = (mode === "work" ? wNum : bNum) * 60
        setSecondsLeft(nextSeconds)
        if (isRunning) targetRef.current = Date.now() + nextSeconds * 1000
        setShowSettings(false)
    }

    const showSettingsPanel = isUserDashboard || showSettings

    return (
        <div className={`timer-container ${showSettings ? 'expanded' : ''} ${isUserDashboard ? 'user-dashboard' : ''}`}>
            <div className={`timer-header ${hideHeader ? 'timer-header-compact' : ''}`}>
                {!hideHeader && <h2>Timer</h2>}
                {!isUserDashboard && (
                    <div className="timer-controls">
                        <button className="icon-button" title="Settings" onClick={() => setShowSettings(s => !s)}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.559.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.894.149c-.424.07-.764.383-.929.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.398.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.272-.806.108-1.204-.165-.397-.506-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                            </svg>

                        </button>
                    </div>
                )}
            </div>

            <div className="timer-body">
                <div className="progress-wrap">
                    <svg className="progress-circle" width="180" height="180" viewBox="0 0 180 180">
                        <circle cx="90" cy="90" r="70" stroke="rgba(255,255,255,0.08)" strokeWidth="12" fill="none" />
                        <circle cx="90" cy="90" r="70" stroke={ringColor} strokeWidth="12" fill="none"
                            strokeDasharray={`${circumference} ${circumference}`}
                            strokeDashoffset={circumference - dash}
                            strokeLinecap="round"
                        />
                    </svg>

                    <div className="timer-center">
                        <div className="mode-label">{mode === "work" ? "Work" : "Break"}</div>
                        <div className="time-display">{formatTime(Math.max(0, secondsLeft))}</div>
                        <div className="cycle-count">Cycles: {cycles}</div>
                    </div>
                </div>

                <div className="timer-actions">
                    <button className="start-button" onClick={toggle}>{isRunning ? 'Pause' : 'Start'}</button>
                    <button className="reset-button" onClick={reset}>Reset</button>
                </div>
            </div>

            {showSettingsPanel && (
                <div className="settings-panel">
                    <div className="settings-row">
                        <label>Work (min)</label>
                        <input type="number" min="1" value={workMin} onChange={e => setWorkMin(Number(e.target.value))} />
                    </div>
                    <div className="settings-row">
                        <label>Break (min)</label>
                        <input type="number" min="1" value={breakMin} onChange={e => setBreakMin(Number(e.target.value))} />
                    </div>
                    <div className="settings-actions">
                        <button className="save-button" onClick={() => saveSettings(workMin, breakMin)}>Save</button>
                        {!isUserDashboard && (
                            <button className="cancel-button" onClick={() => setShowSettings(false)}>Close</button>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Timer