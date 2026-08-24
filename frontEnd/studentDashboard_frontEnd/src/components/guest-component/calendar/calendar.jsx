import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import "./calendar.css";
import "../guest-theme.css";
import CalendarComponent from "./calendar-component";

function Calendar() {
  return (
    <div className="guest-page calendar-container">
      <Header />
      <main className="guest-main calendar-main">
        <Sidebar />
        <CalendarComponent />
      </main>
    </div>
  );
}

export default Calendar;
