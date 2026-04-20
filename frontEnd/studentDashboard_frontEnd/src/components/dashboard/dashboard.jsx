import "./dashboard.css";
import Header from "../header/header";
import { useUser } from "../context/UserContext/GlobalContext";
import TaskList from "../user-component/TaskList/TaskList";
import Sidebar from "../user-component/sidebar/sidebar";
import Timer from "../guest-component/timer/timer";
import Notepad from "../guest-component/notepad/notepad";
import { useEffect, useRef, useState } from "react";
function DashBoard({ props }) {
  const { userData, isLoading, refreshData } = useUser();
  const [panelWidths, setPanelWidths] = useState([40, 36, 24]);
  const [isResizing, setIsResizing] = useState(false);
  const dragStateRef = useRef(null);
  const panelContainerRef = useRef(null);

  const startResize = (dividerIndex, event) => {
    event.preventDefault();
    const containerWidth = panelContainerRef.current?.getBoundingClientRect().width;
    if (!containerWidth) return;

    dragStateRef.current = {
      dividerIndex,
      startX: event.clientX,
      startWidths: [...panelWidths],
      containerWidth,
    };
    setIsResizing(true);
  };

  useEffect(() => {
    if (!isResizing) return;

    const MIN_PANEL_WIDTH = 15;

    const onMouseMove = (event) => {
      const dragState = dragStateRef.current;
      if (!dragState) return;

      const deltaPercent =
        ((event.clientX - dragState.startX) / dragState.containerWidth) * 100;
      const leftPanelIndex = dragState.dividerIndex;
      const rightPanelIndex = leftPanelIndex + 1;
      const leftStart = dragState.startWidths[leftPanelIndex];
      const rightStart = dragState.startWidths[rightPanelIndex];
      const combined = leftStart + rightStart;

      const nextLeft = Math.min(
        Math.max(leftStart + deltaPercent, MIN_PANEL_WIDTH),
        combined - MIN_PANEL_WIDTH,
      );
      const nextRight = combined - nextLeft;

      setPanelWidths((prev) => {
        const next = [...prev];
        next[leftPanelIndex] = nextLeft;
        next[rightPanelIndex] = nextRight;
        return next;
      });
    };

    const onMouseUp = () => {
      dragStateRef.current = null;
      setIsResizing(false);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isResizing]);

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
          <div
            className={`resizable-panels ${isResizing ? "is-resizing" : ""}`}
            ref={panelContainerRef}
          >
            <div
              className="resizable-panel"
              style={{ flexBasis: `${panelWidths[0]}%` }}
            >
              <TaskList
                UserTasks={userData?.user_task}
                CanvasEvent={userData?.canvas_event}
              ></TaskList>
            </div>

            <button
              type="button"
              className="resize-handle"
              onMouseDown={(event) => startResize(0, event)}
              aria-label="Resize task list and timer"
            />

            <div
              className="resizable-panel"
              style={{ flexBasis: `${panelWidths[1]}%` }}
            >
              <Timer isUserDashboard />
            </div>

            <button
              type="button"
              className="resize-handle"
              onMouseDown={(event) => startResize(1, event)}
              aria-label="Resize timer and notepad"
            />

            <div
              className="resizable-panel"
              style={{ flexBasis: `${panelWidths[2]}%` }}
            >
              <Notepad isUserDashboard />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default DashBoard;
