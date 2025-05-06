const express = require('express');
const bodyParser = require('body-parser');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();
const port = 3000;

// PostgreSQL connection setup
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Middleware
app.use(bodyParser.json());

// CORS configuration
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Create 'users' table if it doesn't exist
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL
  )
`).then(() => {
  console.log('Users table is ready.');
}).catch(err => {
  console.error('Error creating users table:', err);
});

// GET all users
app.get('/users', async (req, res) => {
  console.log('Received GET request at /users');
  try {
    const result = await pool.query('SELECT * FROM users');
    res.json(result.rows);
  } catch (err) {
    console.error('Error retrieving users:', err);
    res.status(500).json({ message: err.message });
  }
});

// POST new user
app.post('/users', async (req, res) => {
  const { name, email } = req.body;
  console.log('Received POST request at /users with data:', req.body);
  try {
    await pool.query('INSERT INTO users (name, email) VALUES ($1, $2)', [name, email]);
    res.status(201).json({ message: 'User added' });
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).json({ message: err.message });
  }
});

// Root route
app.get('/', (req, res) => {
  res.send('Welcome to the User API. Use /users to interact.');
});

// Catch-all route for undefined paths
app.use((req, res) => {
  res.status(404).send(`Route not found: ${req.originalUrl}`);
});

// Start the server
app.listen(port, () => {
  console.log(`Backend running at http://localhost:${port}`);
});
