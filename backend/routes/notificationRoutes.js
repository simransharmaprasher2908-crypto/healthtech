const express = require('express');
const { query } = require('../db/database');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { user_id, title, message, type } = req.body;

    if (!user_id || !title || !message) {
      return res.status(400).json({ message: 'user_id, title and message are required.' });
    }

    const result = await query(
      `INSERT INTO notifications (user_id, title, message, type)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [user_id, title, message, type || 'INFO'],
    );

    res.status(201).json({ message: 'Notification created successfully', notification: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create notification', error: error.message });
  }
});

router.get('/user/:userId', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC',
      [req.params.userId],
    );

    res.json({ notifications: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch notifications', error: error.message });
  }
});

module.exports = router;
