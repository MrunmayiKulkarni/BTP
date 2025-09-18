const express = require('express');
const cors = require('cors');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

// Initialize DB file if it doesn't exist
if (!fs.existsSync(DB_FILE)) {
  fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }));
}

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE));

  const userExists = db.users.some(user => user.email === email);

  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  db.users.push({ email, password });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));

  res.status(201).json({ message: 'User created successfully' });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const db = JSON.parse(fs.readFileSync(DB_FILE));

  const user = db.users.find(user => user.email === email && user.password === password);

  if (user) {
    res.status(200).json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});