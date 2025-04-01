const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

// Conectar a SQLite
const db = new sqlite3.Database("todo.db", (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log("Conectado a la base de datos SQLite.");
        db.run(`CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            text TEXT,
            completed INTEGER
        )`);
    }
});

// Obtener todas las tareas
app.get("/tasks", (req, res) => {
    db.all("SELECT * FROM tasks", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Agregar una nueva tarea
app.post("/tasks", (req, res) => {
    const { text } = req.body;
    db.run("INSERT INTO tasks (text, completed) VALUES (?, 0)", [text], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, text, completed: 0 });
    });
});

// Marcar una tarea como completada
app.put("/tasks/:id", (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    db.run("UPDATE tasks SET completed = ? WHERE id = ?", [completed, id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ updated: this.changes });
    });
});

// Eliminar una tarea
app.delete("/tasks/:id", (req, res) => {
    const { id } = req.params;
    db.run("DELETE FROM tasks WHERE id = ?", [id], function (err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ deleted: this.changes });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});