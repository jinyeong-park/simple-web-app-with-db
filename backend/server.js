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

// const db = mysql.createConnection({
//     host: 'todolist.cjs48um081zi.us-east-1.rds.amazonaws.com',
//     user: 'admin',
//     password: 'newpassword123',
//     database: 'todolist',
//     port: 3306
// });



// Check database connection
db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
        return;
    }
    console.log('Connected to the MySQL database.');
});

// Routes
// app.get('/', (req, res) => {
//     res.send('Welcome to the Node.js server!');
//   });
  
// app.get('/api', (req, res) => {
//     res.send('API is working!');
//   });

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
app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
  
    db.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err, results) => {
      if (err) {
        console.error('Error updating todo:', err);
        return res.status(500).json({ message: 'Error updating todo' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json({ message: 'Todo updated successfully!' });
    });
  });



// Delete a todo by title
app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
  
    db.query('DELETE FROM todos WHERE id = ?', [id], (err, results) => {
      if (err) {
        console.error('Error deleting todo:', err);
        return res.status(500).json({ message: 'Error deleting todo' });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: 'Todo not found' });
      }
      res.json({ message: 'Todo deleted successfully!' });
    });
  });



// Start the server
app.listen(8081, () => {
    console.log("Server is running on port 8081.");
});
