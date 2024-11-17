require('dotenv').config();  // Load environment variables
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // To parse JSON bodies

// Database Connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// Check database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Routes

// Fetch all todos
app.get('/todos', (req, res) => {
    const sql = "SELECT * FROM todos";
    db.query(sql, (err, data) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json(data);
    });
});

// Add a new todo
app.post('/todos', (req, res) => {
    const sql = "INSERT INTO todos (id, title, completed) VALUES (?, ?, ?)";
    const { id, title, completed } = req.body;

    db.query(sql, [id, title, completed], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Todo added successfully!" });
    });
});

// Update a todo's completed status
app.put('/todos/:id', (req, res) => {
    const sql = "UPDATE todos SET completed = ? WHERE id = ?";
    const { completed } = req.body;
    const { id } = req.params;

    db.query(sql, [completed, id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Todo updated successfully!" });
    });
});

// Delete a todo
app.delete('/todos/:id', (req, res) => {
    const sql = "DELETE FROM todos WHERE id = ?";
    const { id } = req.params;

    db.query(sql, [id], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        return res.json({ message: "Todo deleted successfully!" });
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});
