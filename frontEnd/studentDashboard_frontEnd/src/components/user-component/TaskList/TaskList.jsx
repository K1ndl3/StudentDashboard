import { useState } from "react";
import "./TaskList.css";
import TaskModal from "./event-modal/task-modal/TaskModal"
import Event from "../TaskList/event/Event"
import CanvasModal from "./event-modal/canvas-modal/CanvasModal";
function TaskList({CanvasEvent = []}) {

  const [CanvasEvents, setCanvasEvents] = useState(CanvasEvent)
  const [userTask, setUserTask] = useState([])
  const [isModalOpen, setIsModalOpen] = useState(false)

  const [isCanvasModalOpen, setIsCanvasModalOpen] = useState(true)

  const handleAddTask = (newTask) => {
      setUserTask([...userTask, newTask])
      console.log("added new task")
  }

  const handleDeleteTask = (id) => {
    const updatedTask =  userTask.filter(task => task.id !== id)
    setUserTask(updatedTask)
    console.log("delete task")
  }

  const handleSyncTaskArray = async () => {
    const response = await fetch("http://localhost:8080/api/")
  }

  return (
    <>
      <div className="container">

        <TaskModal
          isOpen={isModalOpen} 
          onClose={() => {
            setIsModalOpen(false)
          }} 
          onSave={handleAddTask}
        ></TaskModal>

        <div className="user-task">
          <span className="user-task-header">
            <h1 className="title">Tasks</h1>
            <span className="user-task-buttons">
              <button
                    className="add-sync-event-button" 
                    onClick={() => setIsModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                </svg>
                add
              </button>
              <button className="add-sync-event-button"
              ///////////////////////////////////////////////// Here is it for later
                onClick={() => {console.log("sync")}}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
                </svg>
                sync
              </button>
            </span>
          </span>
          {userTask.map((task, index)=> (
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
        <div className="canvas-task"> 
            <CanvasModal
              isOpen={isCanvasModalOpen}
              onClose={() => {
                setIsCanvasModalOpen(false)
                console.log("closing canvas modal")  
              }}
            ></CanvasModal>        
          <div className="canvas-task-header">
            <h1 className="title">Canvas Events</h1>
            <button
              onClick={() => {setIsCanvasModalOpen(true)}}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 13.5 3 3m0 0 3-3m-3 3v-6m1.06-4.19-2.12-2.12a1.5 1.5 0 0 0-1.061-.44H4.5A2.25 2.25 0 0 0 2.25 6v12a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9a2.25 2.25 0 0 0-2.25-2.25h-5.379a1.5 1.5 0 0 1-1.06-.44Z" />
              </svg>
            </button>
          </div>
          <div className="canvas-task-body">
            CPSC 
          </div>
        </div>
      </div>
    </>
  );
}

export default TaskList;
