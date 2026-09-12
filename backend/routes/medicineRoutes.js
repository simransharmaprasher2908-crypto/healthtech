const express = require('express');
const { query } = require('../db/database');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorize('admin', 'facility', 'health_worker'), async (req, res) => {
  try {
    const { facility_id, name, category, stock, unit } = req.body;

    if (!facility_id || !name) {
      return res.status(400).json({ message: 'facility_id and name are required.' });
    }

    const result = await query(
      `INSERT INTO medicines (facility_id, name, category, stock, unit)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [facility_id, name, category || null, stock || 0, unit || null],
    );

    res.status(201).json({ message: 'Medicine added successfully', medicine: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add medicine', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { facility_id, search } = req.query;
    let sql = 'SELECT * FROM medicines';
    const values = [];
    const filters = [];

    if (facility_id) {
      filters.push(`facility_id = $${values.length + 1}`);
      values.push(facility_id);
    }

    if (search) {
      filters.push(`LOWER(name) LIKE $${values.length + 1}`);
      values.push(`%${String(search).toLowerCase()}%`);
    }

    if (filters.length > 0) {
      sql += ' WHERE ' + filters.join(' AND ');
    }

    const result = await query(sql, values);
    res.json({ medicines: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medicines', error: error.message });
  }
});

router.put('/:id/stock', authMiddleware, authorize('admin', 'facility', 'health_worker'), async (req, res) => {
  try {
    const { stock } = req.body;
    const result = await query(
      'UPDATE medicines SET stock = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [stock, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medicine not found.' });
    }

    res.json({ message: 'Medicine stock updated', medicine: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medicine stock', error: error.message });
  }
});

module.exports = router;
