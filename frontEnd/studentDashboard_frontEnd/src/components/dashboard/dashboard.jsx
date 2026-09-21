import "./dashboard.css";
import Header from "../header/header";
import { useUser } from "../context/UserContext/GlobalContext";
import TaskList from "../user-component/TaskList/TaskList";
import Sidebar from "../user-component/sidebar/sidebar";
import Timer from "../guest-component/timer/timer";
import Notepad from "../guest-component/notepad/notepad";
import { useEffect, useRef, useState } from "react";

const PANEL_LABELS = {
  tasks: "Tasks",
  timer: "Timer",
  notes: "Notes",
};
const DEFAULT_PANEL_ORDER = ["tasks", "timer", "notes"];
const DEFAULT_PANEL_WIDTHS = [40, 36, 24];
const TOTAL_DIVIDER_WIDTH = (DEFAULT_PANEL_ORDER.length - 1) * 10;

const getStoredPanelOrder = () => {
  try {
    const storedOrder = JSON.parse(
      localStorage.getItem("user_panel_order") ?? "null",
    );
    const isValidOrder =
      Array.isArray(storedOrder) &&
      storedOrder.length === DEFAULT_PANEL_ORDER.length &&
      DEFAULT_PANEL_ORDER.every((panelId) => storedOrder.includes(panelId));
    return isValidOrder ? storedOrder : DEFAULT_PANEL_ORDER;
  } catch {
    return DEFAULT_PANEL_ORDER;
  }
};

const getStoredPanelWidths = () => {
  try {
    const storedWidths = JSON.parse(
      localStorage.getItem("user_panel_widths") ?? "null",
    );
    const isValidWidths =
      Array.isArray(storedWidths) &&
      storedWidths.length === DEFAULT_PANEL_WIDTHS.length &&
      storedWidths.every((width) => Number.isFinite(width) && width > 0);
    return isValidWidths ? storedWidths : DEFAULT_PANEL_WIDTHS;
  } catch {
    return DEFAULT_PANEL_WIDTHS;
  }
};

function DashBoard() {
  const { userData, isLoading, refreshData } = useUser();
  const [panelOrder, setPanelOrder] = useState(getStoredPanelOrder);
  const [panelWidths, setPanelWidths] = useState(getStoredPanelWidths);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedTab, setDraggedTab] = useState(null);
  const [dragOverTab, setDragOverTab] = useState(null);
  const dragStateRef = useRef(null);
  const panelContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("user_panel_order", JSON.stringify(panelOrder));
  }, [panelOrder]);

  useEffect(() => {
    localStorage.setItem("user_panel_widths", JSON.stringify(panelWidths));
  }, [panelWidths]);

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

  const handleTabDragStart = (panelId, event) => {
    setDraggedTab(panelId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", panelId);
  };

  const handleTabDragOver = (panelId, event) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
    if (panelId !== draggedTab) {
      setDragOverTab(panelId);
    }
  };

  const handleTabDrop = (targetId, event) => {
    event.preventDefault();
    const sourceId = draggedTab;

    if (!sourceId || sourceId === targetId) {
      setDraggedTab(null);
      setDragOverTab(null);
      return;
    }

    const sourceIndex = panelOrder.indexOf(sourceId);
    const targetIndex = panelOrder.indexOf(targetId);
    if (sourceIndex === -1 || targetIndex === -1) return;

    setPanelOrder((currentOrder) => {
      const nextOrder = [...currentOrder];
      const currentSourceIndex = nextOrder.indexOf(sourceId);
      const currentTargetIndex = nextOrder.indexOf(targetId);
      nextOrder[currentSourceIndex] = targetId;
      nextOrder[currentTargetIndex] = sourceId;
      return nextOrder;
    });

    setPanelWidths((currentWidths) => {
      const nextWidths = [...currentWidths];
      [nextWidths[sourceIndex], nextWidths[targetIndex]] = [
        nextWidths[targetIndex],
        nextWidths[sourceIndex],
      ];
      return nextWidths;
    });

    setDraggedTab(null);
    setDragOverTab(null);
  };

  const handleTabDragEnd = () => {
    setDraggedTab(null);
    setDragOverTab(null);
  };

  const renderPanelContent = (panelId) => {
    if (panelId === "tasks") {
      return (
        <TaskList
          UserTasks={userData?.user_task}
          CanvasEvent={userData?.canvas_event}
        />
      );
    }
    if (panelId === "timer") {
      return <Timer isUserDashboard />;
    }
    return <Notepad isUserDashboard />;
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-topbar">
        <Header userName={userData?.name} />
          <button
            className="refresh-button"
            onClick={refreshData}
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Refresh User Data"}
          </button>
      </div>
        <div className="content-container">
          <Sidebar />
          <div className="dashboard-workspace">
            <div
              className={`resizable-panels ${isResizing ? "is-resizing" : ""}`}
              ref={panelContainerRef}
            >
              {panelOrder.map((panelId, index) => {
                const isDragging = draggedTab === panelId;
                const isDragOver = dragOverTab === panelId;

                return (
                  <div key={panelId} className="dashboard-panel-wrapper">
                    {index > 0 && (
                      <button
                        type="button"
                        className="resize-handle"
                        onMouseDown={(event) => startResize(index - 1, event)}
                        aria-label="Resize panels"
                      />
                    )}
                    <section
                      className={`resizable-panel dashboard-panel ${isDragging ? "is-dragging" : ""} ${isDragOver ? "is-drag-over" : ""}`}
                      style={{
                        flexBasis:
                          index === panelOrder.length - 1
                            ? `calc(${panelWidths[index]}% - ${TOTAL_DIVIDER_WIDTH}px)`
                            : `${panelWidths[index]}%`,
                      }}
                      onDragOver={(event) =>
                        handleTabDragOver(panelId, event)
                      }
                      onDragLeave={() => setDragOverTab(null)}
                      onDrop={(event) => handleTabDrop(panelId, event)}
                    >
                      <div
                        className="dashboard-panel-tab"
                        draggable
                        onDragStart={(event) =>
                          handleTabDragStart(panelId, event)
                        }
                        onDragEnd={handleTabDragEnd}
                      >
                        <span
                          className="dashboard-panel-tab-grip"
                          aria-hidden="true"
                        >
                          ⠿
                        </span>
                        <span>{PANEL_LABELS[panelId]}</span>
                      </div>
                      <div className="dashboard-panel-body">
                        {renderPanelContent(panelId)}
                      </div>
                    </section>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
    </div>
  );
}

export default DashBoard;
