const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// MySQL database connection configuration
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'todolist', // Specify the database name
};

// Create a connection to the MySQL server
const connection = mysql.createConnection(dbConfig);

// Connect to the MySQL server
connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL server:', err);
    return;
  }
  console.log('Connected to MySQL server');
  
  // Create the "todolist" table if it doesn't exist
  connection.query(`
    CREATE TABLE IF NOT EXISTS todolist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      text VARCHAR(255) NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT 0
    )
  `, (err) => {
    if (err) {
      console.error('Error creating "todolist" table:', err);
    } else {
      console.log('Table "todolist" created (if it did not exist)');
    }
  });
});

app.use(cors());
app.use(express.json());

// Define your API routes here

// Route to fetch ToDo items
app.get('/todolist', (req, res) => {
  const query = 'SELECT * FROM todolist';
  connection.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching To-Do items: ' + err.message);
      return res.status(500).send('Error fetching To-Do items');
    }
    console.log('To-Do items fetched');
    res.json(results);
  });
});

// Route to add a new ToDo item
app.post('/add', (req, res) => {
  const { text } = req.body;
  const query = 'INSERT INTO todolist (text, completed) VALUES (?, false)';
  connection.query(query, [text], (err, result) => {
    if (err) {
      console.error('Error inserting To-Do item: ' + err.message);
      return res.status(500).send('Error inserting To-Do item');
    }
    console.log('To-Do item inserted');
    res.sendStatus(200);
  });
});

// Route to delete a ToDo item
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const query = 'DELETE FROM todolist WHERE id = ?';
  connection.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting To-Do item: ' + err.message);
      return res.status(500).send('Error deleting To-Do item');
    }
    console.log('To-Do item deleted');
    res.sendStatus(200);
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
