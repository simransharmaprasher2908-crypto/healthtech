const express = require('express');
const { query } = require('../db/database');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { patient_id, doctor_id, facility_id, appointment_date, appointment_time, reason } = req.body;

    if (!patient_id || !doctor_id || !facility_id || !appointment_date || !appointment_time) {
      return res.status(400).json({ message: 'Patient, doctor, facility, date and time are required.' });
    }

    const result = await query(
      `INSERT INTO appointments (patient_id, doctor_id, facility_id, appointment_date, appointment_time, status, reason)
       VALUES ($1, $2, $3, $4, $5, 'SCHEDULED', $6) RETURNING *`,
      [patient_id, doctor_id, facility_id, appointment_date, appointment_time, reason || null],
    );

    res.status(201).json({ message: 'Appointment booked successfully', appointment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to book appointment', error: error.message });
  }
});

router.get('/', authMiddleware, async (req, res) => {
  try {
    const { patient_id, doctor_id, facility_id } = req.query;
    let sql = 'SELECT * FROM appointments';
    const values = [];
    const filters = [];

    if (patient_id) {
      filters.push(`patient_id = $${values.length + 1}`);
      values.push(patient_id);
    }

    if (doctor_id) {
      filters.push(`doctor_id = $${values.length + 1}`);
      values.push(doctor_id);
    }

    if (facility_id) {
      filters.push(`facility_id = $${values.length + 1}`);
      values.push(facility_id);
    }

    if (filters.length > 0) {
      sql += ' WHERE ' + filters.join(' AND ');
    }

    sql += ' ORDER BY appointment_date ASC, appointment_time ASC';
    const result = await query(sql, values);
    res.json({ appointments: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch appointments', error: error.message });
  }
});

router.put('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      ['CANCELLED', req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.json({ message: 'Appointment cancelled', appointment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to cancel appointment', error: error.message });
  }
});

router.put('/:id/status', authMiddleware, authorize('doctor', 'admin', 'facility', 'health_worker'), async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['SCHEDULED', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'IN_PROGRESS'];

    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }

    const result = await query(
      'UPDATE appointments SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    res.json({ message: 'Appointment status updated', appointment: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update appointment status', error: error.message });
  }
});

router.get('/queue/:facilityId', authMiddleware, async (req, res) => {
  try {
    const result = await query(
      'SELECT * FROM appointments WHERE facility_id = $1 AND status IN ($2, $3, $4) ORDER BY appointment_date ASC, appointment_time ASC',
      [req.params.facilityId, 'SCHEDULED', 'CONFIRMED', 'IN_PROGRESS'],
    );

    res.json({ queue: result.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch queue', error: error.message });
  }
});

module.exports = router;
