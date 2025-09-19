const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const port = 3001;

const JWT_SECRET = 'your_super_secret_key'; // IMPORTANT: Use an environment variable in a real app

app.use(cors());
app.use(express.json());

// --- AUTH ENDPOINTS ---

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
  // In a real app, you should hash the password here
  try {
    const [existingUsers] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUsers.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }
    await pool.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length > 0) {
      const user = users[0];
      const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ message: 'Login successful', token });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- AUTH MIDDLEWARE ---

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1]; // Authorization: 'Bearer TOKEN'
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decoded.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// --- WORKOUT ENDPOINTS ---

// GET all workouts for a user
app.get('/api/workouts', checkAuth, async (req, res) => {
  try {
    const [workouts] = await pool.query(
      'SELECT id, exercise_name, workout_date FROM workouts WHERE user_id = ? ORDER BY workout_date DESC',
      [req.userData.userId]
    );

    // For each workout, get its sets
    const workoutsWithSets = await Promise.all(workouts.map(async (workout) => {
      const [sets] = await pool.query('SELECT set_number, reps, weight FROM workout_sets WHERE workout_id = ? ORDER BY set_number ASC', [workout.id]);
      return { ...workout, sets };
    }));

    res.status(200).json(workoutsWithSets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetching workouts failed' });
  }
});

// POST a new workout
app.post('/api/workouts', checkAuth, async (req, res) => {
  const { exercise_name, workout_date, sets } = req.body;
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    // 1. Insert the main workout entry
    const [workoutResult] = await connection.query(
      'INSERT INTO workouts (user_id, exercise_name, workout_date) VALUES (?, ?, ?)',
      [req.userData.userId, exercise_name, workout_date]
    );
    const workoutId = workoutResult.insertId;

    // 2. Insert each set associated with the workout
    for (const set of sets) {
      await connection.query(
        'INSERT INTO workout_sets (workout_id, set_number, reps, weight) VALUES (?, ?, ?, ?)',
        [workoutId, set.set_number, set.reps, set.weight]
      );
    }

    await connection.commit();
    res.status(201).json({ message: 'Workout added successfully' });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Adding workout failed' });
  } finally {
    connection.release();
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});