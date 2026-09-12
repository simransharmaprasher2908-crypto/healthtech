const express = require('express');
const { query } = require('../db/database');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorize('admin', 'facility'), async (req, res) => {
  try {
    const { facility_code, name, type, district, village, phone, availability } = req.body;

    if (!facility_code || !name || !type) {
      return res.status(400).json({ message: 'facility_code, name and type are required.' });
    }

    const result = await query(
      `INSERT INTO facilities (facility_code, name, type, district, village, phone, availability)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [facility_code, name, type, district || null, village || null, phone || null, availability || null],
    );

    res.status(201).json({ message: 'Facility created successfully', facility: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create facility', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, district } = req.query;
    let sql = 'SELECT * FROM facilities';
    const params = [];
    const filters = [];

    if (type) {
      filters.push(`type = $${params.length + 1}`);
      params.push(type);
    }

    if (district) {
      filters.push(`district = $${params.length + 1}`);
      params.push(district);
    }

    if (filters.length > 0) {
      sql += ' WHERE ' + filters.join(' AND ');
    }

    const result = await query(sql, params);
    res.json({ facilities: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facilities', error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM facilities WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Facility not found.' });
    }

    res.json({ facility: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch facility', error: error.message });
  }
});

router.put('/:id', authMiddleware, authorize('admin', 'facility'), async (req, res) => {
  try {
    const { name, type, district, village, phone, availability } = req.body;

    const result = await query(
      `UPDATE facilities
       SET name = COALESCE($1, name), type = COALESCE($2, type), district = COALESCE($3, district), village = COALESCE($4, village), phone = COALESCE($5, phone), availability = COALESCE($6, availability), updated_at = CURRENT_TIMESTAMP
       WHERE id = $7 RETURNING *`,
      [name, type, district, village, phone, availability, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Facility not found.' });
    }

    res.json({ message: 'Facility updated successfully', facility: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update facility', error: error.message });
  }
});

module.exports = router;
