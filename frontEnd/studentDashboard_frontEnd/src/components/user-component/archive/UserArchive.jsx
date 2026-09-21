import Header from "../../header/header";
import { useUser } from "../../context/UserContext/GlobalContext";
import Sidebar from "../sidebar/sidebar";
import ArchivedNotes from "../../guest-component/notepad/ArchivedNotes";
import "../../guest-component/archive/archive.css";
import "../../guest-component/guest-theme.css";

function UserArchive() {
    const { userData } = useUser();

    return (
        <div className="guest-page archive-container">
            <Header userName={userData?.name} />
            <main className="guest-main archive-main">
                <Sidebar />
                <ArchivedNotes isUserDashboard />
            </main>
        </div>
    );
}

export default UserArchive;
