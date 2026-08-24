const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

const filePath = path.join(__dirname, "data", "tasks.json");

app.use(cors());
app.use(express.json());

// get tasks

app.get("/tasks", (req, res) => {
  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Could not read tasks" });
    }

    const tasks = JSON.parse(data);

    res.status(200).json(tasks);
  });
});

// get one task

app.get("/tasks/:id", (req, res) => {
  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Could not read tasks" });
    }

    const tasks = JSON.parse(data);

    const task = tasks.find(
      (task) => task.id === Number(req.params.id)
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json(task);
  });
});

// create task

app.post("/tasks", (req, res) => {
  const { title, description } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "Title and description are required"
    });
  }

  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Could not read tasks" });
    }

    const tasks = JSON.parse(data);

    let newId = 1;

    if (tasks.length > 0) {
      newId = Math.max(...tasks.map((task) => task.id)) + 1;
    }

    const newTask = {
      id: newId,
      title: title,
      description: description,
      completed: false,
      createdAt: new Date().toISOString()
    };

    tasks.push(newTask);

    fs.writeFile(
      filePath,
      JSON.stringify(tasks, null, 2),
      (error) => {
        if (error) {
          return res.status(500).json({
            message: "Could not save task"
          });
        }

        res.status(201).json(newTask);
      }
    );
  });
});

// update task

app.put("/tasks/:id", (req, res) => {
  const { title, description, completed } = req.body;

  if (
    title === undefined ||
    description === undefined ||
    completed === undefined
  ) {
    return res.status(400).json({
      message: "Title, description and completed are required"
    });
  }

  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Could not read tasks" });
    }

    const tasks = JSON.parse(data);

    const taskIndex = tasks.findIndex(
      (task) => task.id === Number(req.params.id)
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    tasks[taskIndex] = {
      ...tasks[taskIndex],
      title: title,
      description: description,
      completed: completed
    };

    fs.writeFile(
      filePath,
      JSON.stringify(tasks, null, 2),
      (error) => {
        if (error) {
          return res.status(500).json({
            message: "Could not update task"
          });
        }

        res.status(200).json(tasks[taskIndex]);
      }
    );
  });
});

// delete task

app.delete("/tasks/:id", (req, res) => {
  fs.readFile(filePath, "utf8", (error, data) => {
    if (error) {
      return res.status(500).json({ message: "Could not read tasks" });
    }

    const tasks = JSON.parse(data);

    const taskIndex = tasks.findIndex(
      (task) => task.id === Number(req.params.id)
    );

    if (taskIndex === -1) {
      return res.status(404).json({ message: "Task not found" });
    }

    tasks.splice(taskIndex, 1);

    fs.writeFile(
      filePath,
      JSON.stringify(tasks, null, 2),
      (error) => {
        if (error) {
          return res.status(500).json({
            message: "Could not delete task"
          });
        }

        res.status(200).json({
          message: "Task deleted"
        });
      }
    );
  });
});

app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
