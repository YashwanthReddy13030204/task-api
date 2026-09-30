import express from "express";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.url}`);
    next();
});

const tasks = [
    { id: 1, title: "Complete lab report", status: "pending", priority: "high" },
    { id: 2, title: "Read chapter 5", status: "completed", priority: "medium" },
    { id: 3, title: "Submit assignment", status: "pending", priority: "high" },
    { id: 4, title: "Review lecture notes", status: "completed", priority: "low" },
    { id: 5, title: "Prepare presentation", status: "pending", priority: "medium" },
    { id: 6, title: "Practice coding", status: "pending", priority: "low" }
];

let nextId = 7;

const validateTask = (req, res, next) => {
    const { title, status, priority } = req.body;

    if (!title || !status || !priority) {
        return res.status(400).json({
            error: "Missing required fields: title, status, priority"
        });
    }

    next();
};

app.get("/tasks", (req, res) => {
    res.status(200).json(tasks);
});

app.get("/tasks/search", (req, res) => {
    const { status } = req.query;

    if (!status) {
        return res.status(200).json(tasks);
    }

    const filtered = tasks.filter(
        (t) => t.status.toLowerCase() === status.toLowerCase()
    );

    res.status(200).json(filtered);
});

app.get("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json(task);
});

app.post("/tasks", validateTask, (req, res) => {
    const newTask = {
        id: nextId++,
        title: req.body.title,
        status: req.body.status,
        priority: req.body.priority
    };

    tasks.push(newTask);

    res.status(201).json(newTask);
});

app.put("/tasks/:id", validateTask, (req, res) => {
    const id = Number(req.params.id);
    const task = tasks.find((t) => t.id === id);

    if (!task) {
        return res.status(404).json({ error: "Task not found" });
    }

    Object.assign(task, req.body);

    res.status(200).json(task);
});

app.delete("/tasks/:id", (req, res) => {
    const id = Number(req.params.id);
    const index = tasks.findIndex((t) => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "Task not found" });
    }

    tasks.splice(index, 1);

    res.status(200).json({
        message: "Task deleted successfully"
    });
});

app.use((req, res) => {
    res.status(404).json({ error: "Route not found" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});