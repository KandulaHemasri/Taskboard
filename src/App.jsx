// import { useState } from "react";
// import "./App.css";

// function App() {
//   const [tasks, setTasks] = useState([]);
//   const [input, setInput] = useState("");

//   // Add task to "To Do"
//   const addTask = () => {
//     if (input === "") return;

//     setTasks([
//       ...tasks,
//       {
//         id: Date.now(),
//         text: input,
//         status: "To Do",
//       },
//     ]);

//     setInput("");
//   };

//   // Move task
//   const moveTask = (id, newStatus) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, status: newStatus } : task
//       )
//     );
//   };

//   // Delete task
//   const deleteTask = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   return (
//     <>
//       <h1>Task Board</h1>

//       <input
//         placeholder="Enter task"
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//       />
//       <button onClick={addTask}>Add Task</button>

//       <div className="board">
//         {["To Do", "In Progress", "Done"].map((column) => (
//           <div className="column" key={column}>
//             <h3>{column}</h3>

//             {tasks
//               .filter((task) => task.status === column)
//               .map((task) => (
//                 <div className="task" key={task.id}>
//                   <p>{task.text}</p>

//                   <button onClick={() => deleteTask(task.id)}>X</button>

//                   {column !== "Done" && (
//                     <button
//                       onClick={() =>
//                         moveTask(
//                           task.id,
//                           column === "To Do"
//                             ? "In Progress"
//                             : "Done"
//                         )
//                       }
//                     >
//                       Move 
//                     </button>
//                   )}
//                 </div>
//               ))}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default App;





// import { useState, useEffect } from "react";


// function App() {
//   // Load tasks from localStorage
//   const [tasks, setTasks] = useState(() => {
//     return JSON.parse(localStorage.getItem("tasks")) || [];
//   });

//   const [input, setInput] = useState("");
//   const [priority, setPriority] = useState("Medium");

//   const [editingId, setEditingId] = useState(null);
//   const [editText, setEditText] = useState("");

//   // Save tasks to localStorage
//   useEffect(() => {
//     localStorage.setItem("tasks", JSON.stringify(tasks));
//   }, [tasks]);

//   // Add task
//   const addTask = () => {
//     if (!input.trim()) return;

//     setTasks([
//       ...tasks,
//       {
//         id: Date.now(),
//         text: input,
//         status: "To Do",
//         priority: priority,
//       },
//     ]);

//     setInput("");
//   };

//   // Move task
//   const moveTask = (id, newStatus) => {
//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, status: newStatus } : task
//       )
//     );
//   };

//   // Delete task
//   const deleteTask = (id) => {
//     setTasks(tasks.filter((task) => task.id !== id));
//   };

//   // Save edited task
//   const saveEdit = (id) => {
//     if (!editText.trim()) return;

//     setTasks(
//       tasks.map((task) =>
//         task.id === id ? { ...task, text: editText } : task
//       )
//     );
//     setEditingId(null);
//     setEditText("");
//   };

//   return (
//     <>
//       <h1>Task Board</h1>

//       {/* Input Section */}
//       <div className="task-input">
//         <input
//           placeholder="Enter task"
//           value={input}
//           onChange={(e) => setInput(e.target.value)}
//         />

//         <select
//           value={priority}
//           onChange={(e) => setPriority(e.target.value)}
//         >
//           <option>High</option>
//           <option>Medium</option>
//           <option>Low</option>
//         </select>

//         <button onClick={addTask}>Add Task</button>
//       </div>

//       {/* Board */}
//       <div className="board">
//         {["To Do", "In Progress", "Done"].map((column) => (
//           <div className="column" key={column}>
//             <h3>{column}</h3>

//             {tasks
//               .filter((task) => task.status === column)
//               .map((task) => (
//                 <div
//                   key={task.id}
//                   className={`task ${task.priority.toLowerCase()}`}
//                 >
//                   {/* Edit / View */}
//                   {editingId === task.id ? (
//                     <div className="edit-box">
//                       <input
//                         value={editText}
//                         onChange={(e) => setEditText(e.target.value)}
//                       />
//                       <button
//                         className="save-btn"
//                         onClick={() => saveEdit(task.id)}
//                       >
//                         Save
//                       </button>
//                     </div>
//                   ) : (
//                     <p
//                       onClick={() => {
//                         setEditingId(task.id);
//                         setEditText(task.text);
//                       }}
//                     >
//                       {task.text}
//                     </p>
//                   )}

//                   {/* Actions */}
//                   <button className="delete-btn" onClick={() => deleteTask(task.id)}>X</button>

//                   {column !== "Done" && (
//                     <button
//                     className="move-btn"
//                       onClick={() =>
//                         moveTask(
//                           task.id,
//                           column === "To Do"
//                             ? "In Progress"
//                             : "Done"
//                         )
//                       }
//                     >
//                       Move
//                     </button>
//                   )}
//                 </div>
//               ))}
//           </div>
//         ))}
//       </div>
//     </>
//   );
// }

// export default App;










import { useEffect, useState } from "react";
import {
  DndContext,
  closestCenter,
  useDroppable,
} from "@dnd-kit/core";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { v4 as uuid } from "uuid";
import "./App.css";

function Column({ id, title, children }) {
  const { setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className="column">
      <h2>{title}</h2>
      {children}
    </div>
  );
}

function TaskCard({ task, onDelete, onEdit }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    borderLeftColor:
      task.priority === "High"
        ? "#ff4d4f"
        : task.priority === "Medium"
        ? "#fadb14"
        : "#52c41a",
  };

  return (
    <div ref={setNodeRef} style={style} className="task-card">
      <div className="task-top">
        <span className="drag-handle" {...listeners} {...attributes}>
         DRAG
        </span>

        {task.editing ? (
          <>
            <input
              value={task.text}
              onChange={(e) => onEdit(task.id, e.target.value)}
            />
            <button
              className="save-btn"
              onClick={() => onEdit(task.id, task.text, true)}
            >
              Save
            </button>
          </>
        ) : (
          <p onClick={() => onEdit(task.id, task.text)}>
            {task.text}
          </p>
        )}
      </div>

      <button
        className="delete-btn"
        onClick={() => onDelete(task.id)}
      >
        ✕
      </button>
    </div>
  );
}

export default function App() {
  const [tasks, setTasks] = useState(
    () => JSON.parse(localStorage.getItem("tasks")) || []
  );
  const [text, setText] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [search, setSearch] = useState("");

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    if (!text.trim()) return;
    setTasks([
      ...tasks,
      {
        id: uuid(),
        text,
        priority,
        status: "todo",
        editing: false,
      },
    ]);
    setText("");
  };

  const deleteTask = (id) => {
    setTasks(tasks.filter((t) => t.id !== id));
  };

  const editTask = (id, value, save = false) => {
    setTasks(
      tasks.map((t) =>
        t.id === id
          ? { ...t, text: value, editing: !save }
          : t
      )
    );
  };

  // const handleDragEnd = ({ active, over }) => {
  //   if (!over) return;

  //   setTasks((prev) =>
  //     prev.map((t) => {
  //       if (t.id !== active.id) return t;

  //       if (t.status === "todo" && over.id === "in-progress") {
  //         return { ...t, status: "in-progress" };
  //       }

  //       if (t.status === "in-progress" && over.id === "done") {
  //         return { ...t, status: "done" };
  //       }

  //       return t;
  //     })
  //   );
  // };


  const handleDragEnd = ({ active, over }) => {
  if (!over) return;

  const activeTask = tasks.find(t => t.id === active.id);
  if (!activeTask) return;

  // If dropped on a column directly
  if (["todo", "in-progress", "done"].includes(over.id)) {
    updateStatus(active.id, over.id);
    return;
  }

  // If dropped on another task → infer its column
  const overTask = tasks.find(t => t.id === over.id);
  if (!overTask) return;

  updateStatus(active.id, overTask.status);
};

const updateStatus = (taskId, newStatus) => {
  setTasks(prev =>
    prev.map(t =>
      t.id === taskId
        ? { ...t, status: newStatus }
        : t
    )
  );
};



  const filtered = tasks.filter((t) =>
    t.text.toLowerCase().includes(search.toLowerCase())
  );

  const todo = filtered.filter((t) => t.status === "todo");
  const inProgress = filtered.filter(
    (t) => t.status === "in-progress"
  );
  const done = filtered.filter((t) => t.status === "done");

  return (
    <div className="app">
      <h1>Task Board</h1>

      <div className="top-controls">
        <input
          placeholder="Enter task"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        >
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>
        <button className="add-btn" onClick={addTask}>
          Add Task
        </button>
      </div>

      <input
        className="search"
        placeholder="Search..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <div className="columns">
          <Column id="todo" title="To Do">
            <SortableContext
              items={todo.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {todo.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              ))}
            </SortableContext>
          </Column>

          <Column id="in-progress" title="In Progress">
            <SortableContext
              items={inProgress.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {inProgress.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              ))}
            </SortableContext>
          </Column>

          <Column id="done" title="Done">
            <SortableContext
              items={done.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {done.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onDelete={deleteTask}
                  onEdit={editTask}
                />
              ))}
            </SortableContext>
          </Column>
        </div>
      </DndContext>
    </div>
  );
}
