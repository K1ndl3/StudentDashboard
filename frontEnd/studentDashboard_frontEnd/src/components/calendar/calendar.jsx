import Sidebar from "../sidebar/sidebar"
import Header from "../header/header"
import "./calendar.css"
function Calendar() {

    return (<>
        <div className="calendar-container">
            <Header></Header>
            <main>
                <Sidebar/>
            </main>
        </div>
    </>)
}

export default Calendar