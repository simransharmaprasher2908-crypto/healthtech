const express = require('express');
const { query } = require('../db/database');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorize('admin', 'facility', 'health_worker'), async (req, res) => {
  try {
    const { facility_id, test_name, available } = req.body;

    if (!facility_id || !test_name) {
      return res.status(400).json({ message: 'facility_id and test_name are required.' });
    }

    const result = await query(
      `INSERT INTO diagnostics (facility_id, test_name, available)
       VALUES ($1, $2, $3) RETURNING *`,
      [facility_id, test_name, available !== undefined ? Boolean(available) : true],
    );

    res.status(201).json({ message: 'Diagnostic test added successfully', diagnostic: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add diagnostic test', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { facility_id, test_name } = req.query;
    let sql = 'SELECT * FROM diagnostics';
    const values = [];
    const filters = [];

    if (facility_id) {
      filters.push(`facility_id = $${values.length + 1}`);
      values.push(facility_id);
    }

    if (test_name) {
      filters.push(`LOWER(test_name) LIKE $${values.length + 1}`);
      values.push(`%${String(test_name).toLowerCase()}%`);
    }

    if (filters.length > 0) {
      sql += ' WHERE ' + filters.join(' AND ');
    }

    const result = await query(sql, values);
    res.json({ diagnostics: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch diagnostic availability', error: error.message });
  }
});

router.get('/search', authMiddleware, async (req, res) => {
  try {
    const { test_name } = req.query;
    if (!test_name) {
      return res.status(400).json({ message: 'test_name is required.' });
    }

    const result = await query(
      'SELECT * FROM diagnostics WHERE LOWER(test_name) LIKE $1 AND available = TRUE',
      [`%${String(test_name).toLowerCase()}%`],
    );

    res.json({ facilities: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to search diagnostics', error: error.message });
  }
});

module.exports = router;
