import "./guest-dashboard.css";
import "../guest-theme.css";
import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import GuestWorkspace from "./GuestWorkspace";

function GuestDashboard() {
  return (
    <div className="guest-page guest-dashboard-container">
      <Header />
      <main className="guest-main">
        <Sidebar />
        <GuestWorkspace />
      </main>
    </div>
  );
}

export default GuestDashboard;
