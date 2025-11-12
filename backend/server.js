const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const authMiddleware = require('./authMiddleware'); // <-- Import the standardized middleware
const profileRoutes = require('./profileRoutes'); // <-- Import profile routes
const multer = require('multer');
const { PythonShell } = require('python-shell');
const fs = require('fs');

const app = express();
const port = 3001;

// --- MULTER CONFIGURATION ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = 'uploads/';
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    // Create a unique filename to avoid conflicts
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });


const JWT_SECRET = 'your_super_secret_key'; // IMPORTANT: Use an environment variable in a real app

// Use CORS and Express JSON middleware
app.use(cors());
app.use(express.json());

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
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const [users] = await pool.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    if (users.length > 0) {
      const user = users[0];
      const token = jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: '1h' }
      );
      res.status(200).json({ 
        token, 
        user: { 
          id: user.id, 
          email: user.email,
          name: user.name, // Ensure these are sent on login
          age: user.age,
          weight: user.weight,
          height: user.height
        } 
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// --- PROFILE ENDPOINTS ---
// Use the imported profile routes, protected by authMiddleware
app.use('/api/profile', authMiddleware, profileRoutes);


// --- WORKOUT LOGGING ENDPOINTS ---

// Get all workout logs for a user (for history page)
app.get('/api/workouts', authMiddleware, async (req, res) => {
  try {
    const [workouts] = await pool.query(
      `SELECT w.id, w.exercise_name AS exercise, w.workout_date, s.set_number, s.reps, s.weight
       FROM workouts w
       JOIN workout_sets s ON w.id = s.workout_id
       WHERE w.user_id = ?
       ORDER BY w.workout_date DESC, w.id DESC, s.set_number ASC`,
      [req.user.id]
    );

    // Group sets by workout ID
    const groupedWorkouts = workouts.reduce((acc, row) => {
      const { id, exercise, workout_date, set_number, reps, weight } = row;
      if (!acc[id]) {
        acc[id] = {
          id,
          exercise, // This will use the aliased 'exercise' from 'w.exercise_name AS exercise'
          workout_date,
          sets: [],
        };
      }
      acc[id].sets.push({ set_number, reps, weight });
      return acc;
    }, {});

    res.status(200).json(Object.values(groupedWorkouts));
  } catch (error) {
    console.error('Failed to fetch workouts:', error);
    res.status(500).json({ message: 'Fetching workout history failed' });
  }
});

// Get progress for a specific exercise
app.get('/api/progress/:exercise', authMiddleware, async (req, res) => {
  const { exercise } = req.params;
  try {
    const [progress] = await pool.query(
      `SELECT w.id, w.workout_date, s.set_number, s.reps, s.weight
       FROM workouts w
       JOIN workout_sets s ON w.id = s.workout_id
       WHERE w.user_id = ? AND w.exercise_name = ?
       ORDER BY w.workout_date DESC, s.set_number ASC`,
      [req.user.id, exercise]
    );
    
    // Group sets by workout ID
    const groupedProgress = progress.reduce((acc, row) => {
      const { id, workout_date, set_number, reps, weight } = row;
      if (!acc[id]) {
        acc[id] = {
          id,
          workout_date,
          sets: [],
        };
      }
      acc[id].sets.push({ set_number, reps, weight });
      return acc;
    }, {});

    res.status(200).json(Object.values(groupedProgress));
  } catch (error) {
    console.error('Failed to fetch progress:', error);
    res.status(500).json({ message: 'Fetching progress failed' });
  }
});

// Add a new workout log
app.post('/api/workouts', authMiddleware, async (req, res) => {
  const { exercise, sets, workout_date } = req.body;
  const userId = req.user.id;

  if (!exercise || !sets || !Array.isArray(sets) || sets.length === 0 || !workout_date) {
    return res.status(400).json({ message: 'Invalid workout data. Exercise, date, and at least one set are required.' });
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Insert into workouts table
    const [workoutResult] = await connection.query(
      'INSERT INTO workouts (user_id, exercise_name, workout_date) VALUES (?, ?, ?)',
      [userId, exercise, workout_date]
    );
    const workoutId = workoutResult.insertId;

    // 2. Prepare and insert sets
    const setValues = sets.map((set, index) => [
      workoutId,
      index + 1, // Use index + 1 for set_number
      set.reps,
      set.weight
    ]);

    await connection.query(
      'INSERT INTO workout_sets (workout_id, set_number, reps, weight) VALUES ?',
      [setValues]
    );

    await connection.commit();
    res.status(201).json({ message: 'Workout logged successfully', workoutId });
  } catch (error) {
    await connection.rollback();
    console.error('Failed to log workout:', error);
    res.status(500).json({ message: 'Logging workout failed' });
  } finally {
    connection.release();
  }
});

// --- ACTIVITY ENDPOINTS ---

app.get('/api/activities', authMiddleware, async (req, res) => {
  try {
    const [activities] = await pool.query(
      'SELECT activity_date, calories, steps, energy FROM daily_activities WHERE user_id = ? ORDER BY activity_date DESC',
      [req.user.id]
    );
    res.status(200).json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    res.status(500).json({ message: 'Fetching activities failed' });
  }
});

app.post('/api/activities', authMiddleware, async (req, res) => {
  const { date, calories, steps, energy } = req.body;
  const userId = req.user.id;

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
    res.status(500).json({ message: 'Failed to log activity' });
  }
});


// --- FILE UPLOAD FOR ACCURACY ---
app.post('/api/upload', authMiddleware, upload.single('file'), async (req, res) => {
  const { exercise } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }
  if (!exercise) {
    return res.status(400).json({ message: 'No exercise specified.' });
  }

  console.log(`File received: ${file.path}, Exercise: ${exercise}`);

  const options = {
    mode: 'text',
    pythonOptions: ['-u'], // unbuffered
    scriptPath: __dirname, // Path to the script (current directory)
    args: [exercise, file.path] // Pass exercise and file path to the script
  };

  try {
    // Wrap the python-shell call in a new promise to ensure correct async/await handling
    const results = await new Promise((resolve, reject) => {
      // --- FIX: Updated the path to the python script ---
      PythonShell.run('scripts/calculate_accuracy.py', options, (err, results) => {
        if (err) {
          console.error('PythonShell Error:', err);
          return reject(err);
        }
        // 'results' is an array of strings printed by the Python script
        console.log('Python script output:', results);
        resolve(results);
      });
    });

    // --- MODIFICATION ---
    // 1. The script now returns a single line of JSON
    if (!results || results.length === 0) {
      throw new Error('Python script returned no output.');
    }
    
    const outputString = results[0];
    const output = JSON.parse(outputString);

    // 2. Validate the new JSON structure
    if (!output || typeof output.overall_accuracy === 'undefined' || !Array.isArray(output.time_series_predictions)) {
        console.error('Python script did not return a valid JSON object:', outputString);
        throw new Error('Invalid output from accuracy script.');
    }

    console.log(`Accuracy calculated: ${output.overall_accuracy}`);
    
    // Clean up the uploaded file
    fs.unlink(file.path, (err) => {
      if (err) console.error(`Failed to delete temp file: ${file.path}`, err);
    });

    // 3. Send the new JSON structure to the frontend
    res.status(200).json({ 
      accuracy: output.overall_accuracy.toFixed(2),
      timeSeries: output.time_series_predictions
    });

  } catch (err) {
    console.error('Error during accuracy calculation:', err);
    
    // Clean up the file even if there's an error
    fs.unlink(file.path, (unlinkErr) => { // A typo was here: file.Tpath, corrected to file.path
      if (unlinkErr) console.error(`Failed to delete temp file after error: ${file.path}`, unlinkErr);
    });
    
    res.status(500).json({ message: 'Error calculating accuracy.', error: err.message });
  }
});


// --- SERVER START ---
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});