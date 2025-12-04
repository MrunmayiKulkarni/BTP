const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'your_username', // <-- Replace with your MySQL username
  password: 'your_password', // <-- Replace with your MySQL password
  database: 'fitness_app_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool
module.exports = pool;

