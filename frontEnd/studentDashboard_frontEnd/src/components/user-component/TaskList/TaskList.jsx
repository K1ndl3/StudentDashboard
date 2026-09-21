import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import "./TaskList.css";
import TaskModal from "./event-modal/task-modal/TaskModal";
import Event from "../TaskList/event/Event";
import CanvasModal from "./event-modal/canvas-modal/CanvasModal";
import { useUser } from "../../context/UserContext/GlobalContext";
import GuestTaskList from "../../guest-component/task-list/task-list";

function TaskList({ CanvasEvent = [], UserTasks }) {
  const { refreshData } = useUser();
  const [CanvasEvents, setCanvasEvents] = useState(CanvasEvent);
  const [userTask, setUserTask] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(false);
  const [canvasFilterEndDate, setCanvasFilterEndDate] = useState("");
  const [canvasHeight, setCanvasHeight] = useState(260);
  const [isCanvasResizing, setIsCanvasResizing] = useState(false);
  const taskListRef = useRef(null);
  const canvasResizeRef = useRef(null);
  const latestUserTasksRef = useRef([]);

  const getCanvasHeight = useCallback((height) => {
    const containerHeight = taskListRef.current?.getBoundingClientRect().height ?? 0;
    const minCanvasHeight = 140;
    const minTaskListHeight = 180;
    const maxCanvasHeight = Math.max(
      minCanvasHeight,
      containerHeight - minTaskListHeight,
    );

    return Math.min(Math.max(height, minCanvasHeight), maxCanvasHeight);
  }, []);

  const startCanvasResize = (event) => {
    event.preventDefault();
    canvasResizeRef.current = {
      startY: event.clientY,
      startHeight: canvasHeight,
    };
    setIsCanvasResizing(true);
  };

  useEffect(() => {
    if (!isCanvasResizing) return;

    const onPointerMove = (event) => {
      const resizeState = canvasResizeRef.current;
      if (!resizeState) return;

      setCanvasHeight(
        getCanvasHeight(resizeState.startHeight - (event.clientY - resizeState.startY)),
      );
    };

    const stopCanvasResize = () => {
      canvasResizeRef.current = null;
      setIsCanvasResizing(false);
    };

    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", stopCanvasResize);
    window.addEventListener("pointercancel", stopCanvasResize);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", stopCanvasResize);
      window.removeEventListener("pointercancel", stopCanvasResize);
    };
  }, [isCanvasResizing, getCanvasHeight]);

  const filteredCanvasEvents = useMemo(() => {
    if (!canvasFilterEndDate) {
      return CanvasEvents;
    }
    const parts = canvasFilterEndDate.split("-").map(Number);
    if (parts.length !== 3 || parts.some((n) => Number.isNaN(n))) {
      return CanvasEvents;
    }
    const [y, m, d] = parts;
    const endMs = new Date(y, m - 1, d, 23, 59, 59, 999).getTime();
    const nowMs = Date.now();
    return CanvasEvents.filter((ev) => {
      if (ev.dueDate == null) return false;
      const dueMs = new Date(ev.dueDate).getTime();
      if (Number.isNaN(dueMs)) return false;
      return dueMs >= nowMs && dueMs <= endMs;
    });
  }, [CanvasEvents, canvasFilterEndDate]);

  const handleAddTask = (newTask) => {
    const updatedTasks = [...userTask, newTask];
    setUserTask(updatedTasks);
    handleSyncTaskArray(updatedTasks);
    console.log("added new task");
  };

  const handleDeleteTask = async (id) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        "http://localhost:8080/api/context/delete-user-task",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            id: id,
          }),
        },
      );

      if (response.ok) {
        const updatedTasks = (latestUserTasksRef.current ?? []).filter(
          (task) => task.id !== id,
        );
        latestUserTasksRef.current = updatedTasks;
        setUserTask(updatedTasks);
        console.log("delete task");
        return true;
      } else {
        const errorText = await response.text();
        console.log("Failed to delete task:", errorText);
        return false;
      }
    } catch (error) {
      console.error("Network error while deleting task:", error);
      return false;
    }
  };

  const handleSyncTaskArray = async (tasksToSync = userTask) => {
    console.log("from function");
    const token = localStorage.getItem("token");
    latestUserTasksRef.current = tasksToSync ?? [];

    try {
      const response = await fetch(
        "http://localhost:8080/api/context/save-user-tasks",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userTask: tasksToSync.map((task) => ({
              ...task,
              // Preserve compatibility with the existing required database column.
              summary: task.summary ?? task.text,
            })),
          }),
        },
      );

      if (response.ok) {
        const message = await response.text();
        console.log("Success:", message);
        return true;
      } else {
        const errorText = await response.text();
        console.log("Failed to save tasks:", errorText);
        return false;
      }
    } catch (error) {
      console.error("Network error while saving tasks:", error);
      return false;
    }
  };

  const handleDeleteCanvasEvent = async (eventId) => {
    if (eventId == null) {
      console.error("Cannot delete a Canvas event without an id");
      return;
    }

    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `http://localhost:8080/api/canvas-events/${encodeURIComponent(eventId)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      if (!response.ok) {
        console.error("Failed to delete Canvas event:", await response.text());
        return;
      }

      setCanvasEvents((events) =>
        events.filter((event) => String(event.id) !== String(eventId)),
      );
      await refreshData();
    } catch (error) {
      console.error("Network error while deleting Canvas event:", error);
    }
  };

  const handleAddCanvasEventToTaskList = async (canvasEvent) => {
    const currentTasks = latestUserTasksRef.current ?? [];
    let taskId = Date.now();
    while (currentTasks.some((task) => Number(task.id) === taskId)) {
      taskId += 1;
    }

    const eventDate = canvasEvent.dueDate ? new Date(canvasEvent.dueDate) : null;
    const dueDate =
      eventDate && !Number.isNaN(eventDate.getTime())
        ? `${eventDate.getFullYear()}-${String(eventDate.getMonth() + 1).padStart(2, "0")}-${String(eventDate.getDate()).padStart(2, "0")}`
        : null;
    const newTask = {
      id: taskId,
      text: canvasEvent.summary ?? "Canvas event",
      summary: canvasEvent.summary ?? "Canvas event",
      description: canvasEvent.description ?? "",
      dueDate,
      completed: false,
      type: "checkbox",
      priority: null,
      completedUnits: 0,
      totalUnits: 10,
      unitLabel: "units",
      subtasks: [],
    };
    const updatedTasks = [...currentTasks, newTask];

    latestUserTasksRef.current = updatedTasks;
    const saved = await handleSyncTaskArray(updatedTasks);
    if (!saved) {
      latestUserTasksRef.current = currentTasks;
      return;
    }

    setUserTask(updatedTasks);
  };

  useEffect(() => {
    if (UserTasks !== undefined) {
      const tasks = UserTasks ?? [];
      latestUserTasksRef.current = tasks;
      setUserTask(tasks);
    }
    setCanvasEvents(CanvasEvent ?? []);
  }, [UserTasks, CanvasEvent]);
  
  return (
    <>
      <div
        className={`container${isCanvasResizing ? " is-canvas-resizing" : ""}`}
        ref={taskListRef}
      >
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
          }}
          onSave={handleAddTask}
        ></TaskModal>

        {userTask !== null && (
          <GuestTaskList
            hideHeader
            remoteTasks={userTask}
            onTasksChange={handleSyncTaskArray}
            onTaskDelete={handleDeleteTask}
          />
        )}

        <div className="user-task">
          <span className="user-task-header">
            <h1 className="title">Tasks</h1>
            <span className="user-task-buttons">
              <button
                className="add-sync-event-button"
                onClick={() => setIsModalOpen(true)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  />
                </svg>
                add
              </button>
              <button
                type="button"
                className="add-sync-event-button"
                onClick={() => {
                  console.log("sync button clicked");
                  handleSyncTaskArray();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="size-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125"
                  />
                </svg>
                sync
              </button>
            </span>
          </span>
          {(userTask ?? []).map((task) => (
            <Event
              onDelete={handleDeleteTask}
              key={task.id}
              id={task.id}
              summary={task.summary}
              description={task.description}
              dueDate={task.dueDate}
            ></Event>
          ))}
        </div>
        <div
          className="canvas-resize-handle"
          role="separator"
          aria-label="Resize Canvas Events section"
          aria-orientation="horizontal"
          tabIndex={0}
          onPointerDown={startCanvasResize}
          onKeyDown={(event) => {
            if (event.key === "ArrowUp") {
              event.preventDefault();
              setCanvasHeight((height) => getCanvasHeight(height + 20));
            } else if (event.key === "ArrowDown") {
              event.preventDefault();
              setCanvasHeight((height) => getCanvasHeight(height - 20));
            }
          }}
        />
        <div className="canvas-task" style={{ height: `${canvasHeight}px` }}>
          <CanvasModal
            isOpen={isCanvasModalOpen}
            onClose={() => setIsCanvasModalOpen(false)}
            onSyncComplete={refreshData}
          />
          <div className="canvas-task-header">
            <h1 className="title">Canvas Events</h1>
            <button
              onClick={() => {
                setIsCanvasModalOpen(true);
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z"
                />
              </svg>
            </button>
          </div>
          <div className="canvas-task-body">
            <label className="canvas-filter-label">
              <span>Show due by</span>
              <input
                type="date"
                className="canvas-filter-date"
                value={canvasFilterEndDate}
                onChange={(e) => setCanvasFilterEndDate(e.target.value)}
              />
            </label>
            {filteredCanvasEvents.length === 0 ? (
              <p className="canvas-task-empty">
                {canvasFilterEndDate
                  ? "No Canvas events due in this range."
                  : "No Canvas events yet. Add a calendar link above."}
              </p>
            ) : (
              filteredCanvasEvents.map((ev) => (
                <Event
                  key={ev.id}
                  id={ev.id}
                  summary={ev.summary}
                  description={ev.description}
                  dueDate={ev.dueDate}
                  onDelete={handleDeleteCanvasEvent}
                  onAddToTaskList={() => handleAddCanvasEventToTaskList(ev)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskList;
