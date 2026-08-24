import { useEffect, useRef, useState } from "react";
import TaskList from "../task-list/task-list";
import Timer from "../timer/timer";
import Notepad from "../notepad/notepad";
import "./guest-workspace.css";

const PANEL_CONFIG = {
  tasks: { label: "Task List", Component: TaskList },
  timer: { label: "Timer", Component: Timer },
  notes: { label: "Notes", Component: Notepad },
};

const DEFAULT_ORDER = ["tasks", "timer", "notes"];
const DEFAULT_WIDTHS = [34, 33, 33];

function GuestWorkspace() {
  const [panelOrder, setPanelOrder] = useState(() => {
    try {
      const saved = localStorage.getItem("guest_panel_order");
      return saved ? JSON.parse(saved) : DEFAULT_ORDER;
    } catch {
      return DEFAULT_ORDER;
    }
  });

  const [panelWidths, setPanelWidths] = useState(() => {
    try {
      const saved = localStorage.getItem("guest_panel_widths");
      return saved ? JSON.parse(saved) : DEFAULT_WIDTHS;
    } catch {
      return DEFAULT_WIDTHS;
    }
  });

  const [isResizing, setIsResizing] = useState(false);
  const [draggedTab, setDraggedTab] = useState(null);
  const [dragOverTab, setDragOverTab] = useState(null);
  const dragStateRef = useRef(null);
  const panelContainerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("guest_panel_order", JSON.stringify(panelOrder));
  }, [panelOrder]);

  useEffect(() => {
    localStorage.setItem("guest_panel_widths", JSON.stringify(panelWidths));
  }, [panelWidths]);

  const startResize = (dividerIndex, event) => {
    event.preventDefault();
    const containerWidth =
      panelContainerRef.current?.getBoundingClientRect().width;
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

    const MIN_PANEL_WIDTH = 18;

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

    setPanelOrder((prev) => {
      const next = [...prev];
      const sourceIdx = next.indexOf(sourceId);
      const targetIdx = next.indexOf(targetId);
      next[sourceIdx] = targetId;
      next[targetIdx] = sourceId;
      return next;
    });

    setPanelWidths((prev) => {
      const sourceIdx = panelOrder.indexOf(sourceId);
      const targetIdx = panelOrder.indexOf(targetId);
      const next = [...prev];
      [next[sourceIdx], next[targetIdx]] = [next[targetIdx], next[sourceIdx]];
      return next;
    });

    setDraggedTab(null);
    setDragOverTab(null);
  };

  const handleTabDragEnd = () => {
    setDraggedTab(null);
    setDragOverTab(null);
  };

  return (
    <div
      className={`guest-workspace ${isResizing ? "is-resizing" : ""}`}
      ref={panelContainerRef}
    >
      {panelOrder.map((panelId, index) => {
        const { label, Component } = PANEL_CONFIG[panelId];
        const isDragging = draggedTab === panelId;
        const isDragOver = dragOverTab === panelId;

        return (
          <div key={panelId} className="guest-panel-wrapper">
            {index > 0 && (
              <button
                type="button"
                className="guest-resize-handle"
                onMouseDown={(event) => startResize(index - 1, event)}
                aria-label="Resize panels"
              />
            )}
            <div
              className={`guest-panel ${isDragging ? "is-dragging" : ""} ${isDragOver ? "is-drag-over" : ""}`}
              style={{ flexBasis: `${panelWidths[index]}%` }}
              onDragOver={(event) => handleTabDragOver(panelId, event)}
              onDragLeave={() => setDragOverTab(null)}
              onDrop={(event) => handleTabDrop(panelId, event)}
            >
              <div
                className="guest-panel-tab"
                draggable
                onDragStart={(event) => handleTabDragStart(panelId, event)}
                onDragEnd={handleTabDragEnd}
              >
                <span className="guest-panel-tab-grip" aria-hidden="true">
                  ⠿
                </span>
                <span className="guest-panel-tab-label">{label}</span>
              </div>
              <div className="guest-panel-body">
                <Component accentColor="#7a7a7a" hideHeader />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default GuestWorkspace;
