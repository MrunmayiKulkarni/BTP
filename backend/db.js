const mysql = require('mysql2/promise');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root', // <-- Replace with your MySQL username
  password: '30Saga04#', // <-- Replace with your MySQL password
  database: 'fitness_app_db', // <-- Replace with your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Export the pool
module.exports = pool;