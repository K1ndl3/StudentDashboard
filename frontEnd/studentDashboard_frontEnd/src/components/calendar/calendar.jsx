import Sidebar from "../sidebar/sidebar"
import Header from "../header/header"
import "./calendar.css"
import "./calendar-component"
import CalendarComponent from "./calendar-component"
function Calendar() {

    return (<>
        <div className="calendar-container">
            <Header></Header>
            <main>
                <Sidebar/>
                <CalendarComponent/>
            </main>
        </div>
    </>)
}

export default Calendar