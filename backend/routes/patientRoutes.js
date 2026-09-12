const express = require('express');
const { query } = require('../db/database');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', authMiddleware, authorize('admin', 'health_worker'), async (req, res) => {
  try {
    const { name, phone, age, gender, village, district, emergency_contact } = req.body;

    if (!name || !phone) {
      return res.status(400).json({ message: 'Name and phone are required.' });
    }

    const patientId = `PAT-${Date.now()}`;
    const patientResult = await query(
      'INSERT INTO patients (patient_id, age, gender, village, district, emergency_contact) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [patientId, age || null, gender || null, village || null, district || null, emergency_contact || null],
    );

    res.status(201).json({ message: 'Patient created successfully', patient: patientResult.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create patient', error: error.message });
  }
});

router.get('/profile/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const patient = await query(
      'SELECT p.*, u.name, u.phone, u.email FROM patients p LEFT JOIN users u ON u.id = p.user_id WHERE p.id = $1 OR p.patient_id = $2',
      [id, id],
    );

    if (patient.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json({ patient: patient.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch patient profile', error: error.message });
  }
});

router.put('/profile/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { age, gender, village, district, emergency_contact } = req.body;

    const result = await query(
      'UPDATE patients SET age = COALESCE($1, age), gender = COALESCE($2, gender), village = COALESCE($3, village), district = COALESCE($4, district), emergency_contact = COALESCE($5, emergency_contact), updated_at = CURRENT_TIMESTAMP WHERE id = $6 OR patient_id = $6 RETURNING *',
      [age, gender, village, district, emergency_contact, id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Patient not found.' });
    }

    res.json({ message: 'Patient profile updated', patient: result.rows[0] });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update patient profile', error: error.message });
  }
});

router.get('/medical-records/:patientId', authMiddleware, async (req, res) => {
  try {
    const { patientId } = req.params;
    const records = await query(
      'SELECT * FROM medical_records WHERE patient_id = $1 ORDER BY visit_date DESC',
      [patientId],
    );

    res.json({ records: records.rows });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch medical records', error: error.message });
  }
});

module.exports = router;
