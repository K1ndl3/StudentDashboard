import Sidebar from "../../sidebar/sidebar";
import Header from "../../header/header";
import ArchivedNotes from "../notepad/ArchivedNotes";
import "./archive.css";
import "../guest-theme.css";

function Archive() {
    return (
        <div className="guest-page archive-container">
            <Header />
            <main className="guest-main archive-main">
                <Sidebar />
                <ArchivedNotes />
            </main>
        </div>
    );
}

export default Archive;
