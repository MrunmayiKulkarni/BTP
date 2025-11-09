const express = require('express');
const pool = require('./db');
const authMiddleware = require('./authMiddleware');

const router = express.Router();

// GET /api/profile - Fetch user profile
router.get('/', authMiddleware, async (req, res) => {
  try {
    const [profile] = await pool.query(
      `SELECT u.id, u.email, p.name, p.age, p.weight, p.height, p.gender 
       FROM users u 
       LEFT JOIN user_profiles p ON u.id = p.user_id 
       WHERE u.id = ?`,
      [req.user.id]
    );
    if (profile.length > 0) {
      res.status(200).json(profile[0]);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Fetching user data failed' });
  }
});

// POST /api/profile - Create or update user profile
router.post('/', authMiddleware, async (req, res) => {
  const { name, age, weight, height, gender } = req.body;
  const userId = req.user.id;

  try {
    const sql = `
      INSERT INTO user_profiles (user_id, name, age, weight, height, gender)
      VALUES (?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        name = VALUES(name),
        age = VALUES(age),
        weight = VALUES(weight),
        height = VALUES(height),
        gender = VALUES(gender)
    `;
    await pool.query(sql, [userId, name, age, weight, height, gender]);
    res.status(200).json({ message: 'Profile saved successfully' });
  } catch (error) {
    console.error('Failed to save profile:', error);
    res.status(500).json({ message: 'Failed to save profile' });
  }
});

module.exports = router;
