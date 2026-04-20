import "./dashboard.css";
import Header from "../header/header";
import { useUser } from "../context/UserContext/GlobalContext";
import TaskList from "../user-component/TaskList/TaskList";
import Sidebar from "../user-component/sidebar/sidebar";
import Timer from "../guest-component/timer/timer";
import Notepad from "../guest-component/notepad/notepad";
function DashBoard({ props }) {
  const { userData, isLoading, refreshData } = useUser();
  return (
    <>
      <div className="dashboard-container">
        <span>
          <Header userName={userData?.name}></Header>
          <button
            className="refresh-button"
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh User Data"}
          </button>
        </span>
        <div className="content-container">
          <Sidebar></Sidebar>
          <TaskList
            UserTasks={userData?.user_task}
            CanvasEvent={userData?.canvas_event}  
          ></TaskList>
          <Timer isUserDashboard />
          <Notepad isUserDashboard />
        </div>
      </div>
    </>
  );
}

export default DashBoard;
