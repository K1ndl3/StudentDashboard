import "./calendar-component.css"



function CalendarComponent() {
    const currDate = new Date();
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth()
    const daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const getMonthName = (m) => {
        switch (m) {
            case 0: return "January";
            case 1: return "February";
            case 2: return "March";
            case 3: return "April";
            case 4: return "May";
            case 5: return "June";
            case 6: return "July";
            case 7: return "August";
            case 8: return "September";
            case 9: return "October";
            case 10: return "November";
            case 11: return "December";
            default: return "Unknown";
        }
    }

    return (<>
        <div className="calendar-component-container">
            <div className="calendar-header">
                <h1>
                    {currYear}
                </h1>
                <h1>
                    {getMonthName(currMonth)}
                </h1>
            </div>
            <ul className="day-of-week">
                {daysArray.map((days, day_index) => (
                    <li key={day_index} className="day">
                        {days}
                    </li>
                ))}    
            </ul>            
        </div>
    </>)
}

export default CalendarComponent