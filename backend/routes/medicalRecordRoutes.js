const express = require('express');
const { query } = require('../db/database');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { patient_id, doctor_id, diagnosis, symptoms, prescription, notes, visit_date } = req.body;

    if (!patient_id || !visit_date) {
      return res.status(400).json({ message: 'patient_id and visit_date are required.' });
    }

    const result = await query(
      `INSERT INTO medical_records (patient_id, doctor_id, diagnosis, symptoms, prescription, notes, visit_date)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [patient_id, doctor_id || null, diagnosis || null, symptoms || null, prescription || null, notes || null, visit_date],
    );

    res.status(201).json({ message: 'Medical record added successfully', record: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add medical record', error: error.message });
  }
});

router.get('/patient/:patientId', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM medical_records WHERE patient_id = $1 ORDER BY visit_date DESC',
      [req.params.patientId],
    );

    res.json({ records: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch records', error: error.message });
  }
});

router.put('/:id', authMiddleware, authorize('doctor', 'admin'), async (req, res) => {
  try {
    const { diagnosis, symptoms, prescription, notes } = req.body;

    const result = await query(
      `UPDATE medical_records
       SET diagnosis = COALESCE($1, diagnosis), symptoms = COALESCE($2, symptoms), prescription = COALESCE($3, prescription), notes = COALESCE($4, notes), updated_at = CURRENT_TIMESTAMP
       WHERE id = $5 RETURNING *`,
      [diagnosis, symptoms, prescription, notes, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Medical record not found.' });
    }

    res.json({ message: 'Medical record updated successfully', record: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update medical record', error: error.message });
  }
});

module.exports = router;
