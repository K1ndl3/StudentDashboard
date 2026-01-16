import { useState } from "react";
import "./calendar-component.css"
import "./day.jsx"
import Day from "./day.jsx";
import DatePopup from "./date-popup.jsx";


function CalendarComponent() {
    const [selectedDate, setSeletectedDate] = useState(null)

    const currDate = new Date();
    const currYear = currDate.getFullYear()
    const currMonth = currDate.getMonth()
    const daysArray = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
    const padMonthArr = () => {
        const daysInMonth = [
        31, // Jan
        28, // Feb 
        31, // Mar
        30, // Apr
        31, // May
        30, // Jun
        31, // Jul
        31, // Aug
        30, // Sep
        31, // Oct
        30, // Nov
        31  // Dec
        ];

        const firstDay = new Date(currYear, currMonth, 1)
        const day = firstDay.getDay();
        const pad = (day == 0) ? 6 : day - 1
        const padArr = []
        let date = 1
        for (let i = 0; i < pad + daysInMonth[currMonth]; i += 1) {
            if (i < pad) {
                padArr.push({dayNumber : null, isoDate : null, hasEvents: false});
            } else {
                const isoDate = `${currYear}-${String(currMonth + 1).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
                const hasEvent = localStorage.getItem(isoDate) ? true : false;
                padArr.push({ date, isoDate, hasEvent });
                date += 1;
            }
        }
        return padArr
    }

    const handleClick = (isoDate) => {
        setSeletectedDate(isoDate)
    }


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
    const dateArr = padMonthArr();
    return (<>
        <div className="calendar-page">

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
                <div className="dates">
                    {dateArr.map((date, date_index) => {
                        return (
                        <li key={date_index}>
                            <Day
                                key={date_index}
                                dayNumber={date.date}
                                isoDate={date.isoDate}
                                hasEvent={date.hasEvent}
                                onClick={handleClick}
                                />
                        </li>
                    )})}
                </div>        
            </div>
            {selectedDate && <DatePopup isoDate={selectedDate}
                       onClose={() => setSeletectedDate(null)}>

            </DatePopup>}
        </div>
    </>)
}

export default CalendarComponent