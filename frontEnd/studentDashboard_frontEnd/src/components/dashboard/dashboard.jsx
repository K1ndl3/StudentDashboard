import "./dashboard.css";
import Header from "../header/header";
import { useUser } from "../context/UserContext/GlobalContext";
import TaskList from "../user-component/TaskList/TaskList";
import Sidebar from "../user-component/sidebar/sidebar";
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
            CanvasEvent={userData?.canvas_event}  
          ></TaskList>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
