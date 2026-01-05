import Timer from "../timer/timer"
import "./guest-dashboard.css"
import Sidebar from "../sidebar/sidebar"
import Notepad from "../notepad/notepad"
import TaskList from "../task-list/task-list"
import Header from "../header/header"

function GuestDashboard() {
    

    return (
        <>
        <div className="guest-dashboard-container">
            <Header />
            <main>
                <Sidebar/>
                <div className="components">
                    <TaskList/>
                    <div className="right-side-component">
                        <Timer/>
                        <Notepad/>
                    </div>
                </div>
            </main>
        </div>
        </>
    )
}

export default GuestDashboard