import { useNavigate } from "react-router-dom"
import "./sidebar.css"

function Sidebar() {

    const navigate = useNavigate()

    return (<>
        <div className="sidebar-container">
            <button className="dashboard-button"
                onClick={() => navigate("/guest-dashboard")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="rgb(63, 41, 186)" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
                </svg>
                Dashboard
            </button>
            <button className="focus-button"
                onClick={() => navigate("/focus")}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="rgb(63, 41, 186)" className="size-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
                </svg>
                Focus
            </button>
        </div>
    </>)
}


export default Sidebar