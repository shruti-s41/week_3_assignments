import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:5000/tasks";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [adding, setAdding] = useState(false);
  const [filter, setFilter] = useState("all");
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  function fetchTasks() {
    setLoading(true);
    setError("");

    fetch(API_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not get tasks");
        }

        return response.json();
      })
      .then((data) => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Could not load tasks");
        setLoading(false);
      });
  }

  function addTask(event) {
    event.preventDefault();

    if (!title || !description) {
      return;
    }

    setAdding(true);

    fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        description: description
      })
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not add task");
        }

        return response.json();
      })
      .then((newTask) => {
        setTasks([...tasks, newTask]);
        setTitle("");
        setDescription("");
        setAdding(false);
      })
      .catch(() => {
        setError("Could not add task");
        setAdding(false);
      });
  }

  function updateTask(task) {
    fetch(API_URL + "/" + task.id, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(task)
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not update task");
        }

        return response.json();
      })
      .then((updatedTask) => {
        const newTasks = tasks.map((task) => {
          if (task.id === updatedTask.id) {
            return updatedTask;
          }

          return task;
        });

        setTasks(newTasks);
        setEditingTask(null);
      })
      .catch(() => {
        setError("Could not update task");
      });
  }

  function deleteTask(id) {
    const answer = window.confirm(
      "Are you sure you want to delete this task?"
    );

    if (!answer) {
      return;
    }

    fetch(API_URL + "/" + id, {
      method: "DELETE"
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not delete task");
        }

        return response.json();
      })
      .then(() => {
        const newTasks = tasks.filter((task) => task.id !== id);

        setTasks(newTasks);
      })
      .catch(() => {
        setError("Could not delete task");
      });
  }

  function toggleTask(task) {
    const updatedTask = {
      ...task,
      completed: !task.completed
    };

    updateTask(updatedTask);
  }

  let filteredTasks = tasks.filter((task) => {
    if (filter === "active") {
      return !task.completed;
    }

    if (filter === "completed") {
      return task.completed;
    }

    return true;
  });

  return (
    <div className="app">
      <h1>Task Manager</h1>

      {/* add task */}

      <form className="task-form" onSubmit={addTask}>
        <h2>Add Task</h2>

        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          placeholder="Task description"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        ></textarea>

        <button type="submit" disabled={adding}>
          {adding ? "Adding..." : "Add Task"}
        </button>
      </form>

      {/* filters */}

      <div className="filters">
        <button onClick={() => setFilter("all")}>
          All
        </button>

        <button onClick={() => setFilter("active")}>
          Active
        </button>

        <button onClick={() => setFilter("completed")}>
          Completed
        </button>
      </div>

      {/* tasks */}

      <div className="tasks">
        <h2>Tasks</h2>

        {loading && <p>Loading tasks...</p>}

        {error && <p className="error">{error}</p>}

        {!loading && filteredTasks.length === 0 && (
          <p>No tasks found.</p>
        )}

        {filteredTasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            onDelete={deleteTask}
            onToggle={toggleTask}
            onEdit={setEditingTask}
          />
        ))}
      </div>

      {/* edit task */}

      {editingTask && (
        <EditTask
          task={editingTask}
          onUpdate={updateTask}
          onCancel={() => setEditingTask(null)}
        />
      )}
    </div>
  );
}

// task

function Task({ task, onDelete, onToggle, onEdit }) {
  return (
    <div className="task">
      <div>
        <h3 className={task.completed ? "completed" : ""}>
          {task.title}
        </h3>

        <p>{task.description}</p>

        <p>
          Status: {task.completed ? "Completed" : "Active"}
        </p>
      </div>

      <div className="task-buttons">
        <button onClick={() => onToggle(task)}>
          {task.completed ? "Mark Active" : "Complete"}
        </button>

        <button onClick={() => onEdit(task)}>
          Edit
        </button>

        <button onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </div>
  );
}

// edit task

function EditTask({ task, onUpdate, onCancel }) {
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);

  function saveTask(event) {
    event.preventDefault();

    const updatedTask = {
      ...task,
      title: title,
      description: description
    };

    onUpdate(updatedTask);
  }

  return (
    <div className="edit-box">
      <h2>Edit Task</h2>

      <form onSubmit={saveTask}>
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />

        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        ></textarea>

        <button type="submit">
          Save
        </button>

        <button type="button" onClick={onCancel}>
          Cancel
        </button>
      </form>
    </div>
  );
}

export default App;
