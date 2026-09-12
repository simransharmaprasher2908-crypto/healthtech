const express = require('express');
const { query } = require('../db/database');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { patient_id, referring_facility_id, receiving_facility_id, reason } = req.body;

    if (!patient_id || !referring_facility_id) {
      return res.status(400).json({ message: 'patient_id and referring_facility_id are required.' });
    }

    const result = await query(
      `INSERT INTO referrals (patient_id, referring_facility_id, receiving_facility_id, reason, status)
       VALUES ($1, $2, $3, $4, 'CREATED') RETURNING *`,
      [patient_id, referring_facility_id, receiving_facility_id || null, reason || null],
    );

    res.status(201).json({ message: 'Referral created successfully', referral: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create referral', error: error.message });
  }
});

router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const result = await query('SELECT * FROM referrals WHERE id = $1', [req.params.id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Referral not found.' });
    }

    res.json({ referral: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch referral', error: error.message });
  }
});

router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    const valid = ['CREATED', 'HOSPITAL_ASSIGNED', 'APPOINTMENT_SCHEDULED', 'PATIENT_REACHED', 'TREATMENT_COMPLETED'];

    if (!valid.includes(status)) {
      return res.status(400).json({ message: 'Invalid referral status.' });
    }

    const result = await query(
      'UPDATE referrals SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *',
      [status, req.params.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Referral not found.' });
    }

    res.json({ message: 'Referral status updated', referral: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update referral status', error: error.message });
  }
});

module.exports = router;
