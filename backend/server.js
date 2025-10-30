const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');

const app = express();
const port = 3001;

const JWT_SECRET = 'your_super_secret_key'; // IMPORTANT: Use an environment variable in a real app

// Use CORS and Express JSON middleware
app.use(cors());
app.use(express.json());

// --- AUTH MIDDLEWARE ---
const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, JWT_SECRET);
    req.userData = { userId: decodedToken.userId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Authentication failed' });
  }
};

// --- AUTH ENDPOINTS ---

app.post('/signup', async (req, res) => {
  const { email, password } = req.body;
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
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.status(200).json({ token, user: { id: user.id, email: user.email } });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- USER ENDPOINTS ---

app.get('/api/user', checkAuth, async (req, res) => {
  try {
    const [users] = await pool.query('SELECT id, email FROM users WHERE id = ?', [req.userData.userId]);
    if (users.length > 0) {
      res.status(200).json(users[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetching user data failed' });
  }
});

// --- WORKOUT ENDPOINTS ---

app.get('/api/workouts', checkAuth, async (req, res) => {
  try {
    const [workouts] = await pool.query(
      'SELECT id, exercise_name, workout_date FROM workouts WHERE user_id = ? ORDER BY workout_date DESC, id DESC',
      [req.userData.userId]
    );
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

app.post('/api/workouts', checkAuth, async (req, res) => {
  const { exercise_name, workout_date, sets } = req.body;
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const [workoutResult] = await connection.query(
      'INSERT INTO workouts (user_id, exercise_name, workout_date) VALUES (?, ?, ?)',
      [req.userData.userId, exercise_name, workout_date]
    );
    const workoutId = workoutResult.insertId;
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
    res.status(500).json({ message: 'Failed to add workout' });
  } finally {
    connection.release();
  }
});

// --- ACTIVITY ENDPOINTS (This is the missing part!) ---

app.get('/api/activities', checkAuth, async (req, res) => {
  try {
    const [activities] = await pool.query(
      'SELECT activity_date, calories, steps, energy FROM daily_activities WHERE user_id = ? ORDER BY activity_date DESC',
      [req.userData.userId]
    );
    res.status(200).json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    res.status(500).json({ message: 'Fetching activities failed' });
  }
});

app.post('/api/activities', checkAuth, async (req, res) => {
  const { date, calories, steps, energy } = req.body;
  const userId = req.userData.userId;

  if (!date || calories === undefined || steps === undefined || energy === undefined) {
    return res.status(400).json({ message: 'Missing required fields: date, calories, steps, energy' });
  }

  try {
    const sql = `
      INSERT INTO daily_activities (user_id, activity_date, calories, steps, energy)
      VALUES (?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE calories = VALUES(calories), steps = VALUES(steps), energy = VALUES(energy)
    `;
    await pool.query(sql, [userId, date, calories, steps, energy]);
    res.status(201).json({ message: 'Activity logged successfully' });
  } catch (error) {
    console.error('Failed to log activity:', error);
    res.status(500).json({ message: 'Logging activity failed' });
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});