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

// Update a todo's completed based on the title < need to debug more..
app.put('/todos/:title', (req, res) => {
    const { title } = req.params;  // Get title from URL params
    const { completed } = req.body;  // Get completed status from the request body

    // Ensure completed is a valid number (1 for true, 0 for false)
    const completedStatus = completed ? 1 : 0;

    const sql = "UPDATE todos SET completed = ? WHERE title = ?";

    db.query(sql, [completedStatus, title], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });

        // Check if any row was affected
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }

        return res.json({ message: "Todo updated successfully!" });
    });
});



// Delete a todo by title
app.delete('/todos/:title', (req, res) => {
    const { title } = req.params;
    const sql = "DELETE FROM todos WHERE title = ?";

    db.query(sql, [title], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Todo not found" });
        }
        return res.json({ message: "Todo deleted successfully!" });
    });
});

// Start the server
app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});
