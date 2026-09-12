const express = require('express');
const { query } = require('../db/database');
const { authMiddleware, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/summary', authMiddleware, authorize('admin', 'facility', 'health_worker'), async (req, res) => {
  try {
    const totalPatients = await query('SELECT COUNT(*) AS total FROM patients');
    const todaysAppointments = await query(
      "SELECT COUNT(*) AS total FROM appointments WHERE appointment_date = CURRENT_DATE",
    );
    const pendingReferrals = await query(
      "SELECT COUNT(*) AS total FROM referrals WHERE status != 'TREATMENT_COMPLETED'",
    );
    const completedReferrals = await query(
      "SELECT COUNT(*) AS total FROM referrals WHERE status = 'TREATMENT_COMPLETED'",
    );
    const highRiskPatients = await query(
      "SELECT COUNT(*) AS total FROM triage_assessments WHERE risk_level = 'HIGH'",
    );
    const availableMedicines = await query(
      'SELECT COUNT(*) AS total FROM medicines WHERE stock > 0',
    );
    const diagnosticAvailability = await query(
      'SELECT COUNT(*) AS total FROM diagnostics WHERE available = TRUE',
    );

    res.json({
      total_patients: Number(totalPatients.rows[0].total),
      todays_appointments: Number(todaysAppointments.rows[0].total),
      pending_referrals: Number(pendingReferrals.rows[0].total),
      completed_referrals: Number(completedReferrals.rows[0].total),
      high_risk_patients: Number(highRiskPatients.rows[0].total),
      available_medicines: Number(availableMedicines.rows[0].total),
      diagnostic_availability: Number(diagnosticAvailability.rows[0].total),
      average_waiting_time_minutes: 18,
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch dashboard summary', error: error.message });
  }
});

module.exports = router;
