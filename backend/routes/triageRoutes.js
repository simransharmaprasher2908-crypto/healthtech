const express = require('express');
const { query } = require('../db/database');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

const assessRisk = (symptoms, age) => {
  const symptomText = String(symptoms || '').toLowerCase();
  const severeKeywords = ['chest pain', 'difficulty breathing', 'severe bleeding', 'unconscious', 'stroke', 'seizure', 'high fever', 'shock'];
  const mediumKeywords = ['fever', 'cough', 'vomiting', 'diarrhea', 'headache', 'weakness', 'pain'];

  if (severeKeywords.some((keyword) => symptomText.includes(keyword)) || (age !== null && age > 65 && symptomText.includes('breathing'))) {
    return { risk_level: 'HIGH', recommendation: 'Immediate assessment by a clinician and urgent referral is recommended. This is a decision-support prototype and not a diagnosis.', escalation_required: true };
  }

  if (mediumKeywords.some((keyword) => symptomText.includes(keyword))) {
    return { risk_level: 'MEDIUM', recommendation: 'Schedule a clinical review soon and monitor symptoms closely. This is a decision-support prototype and not a diagnosis.', escalation_required: true };
  }

  return { risk_level: 'LOW', recommendation: 'Symptoms appear relatively stable; encourage routine observation and follow-up if they worsen. This is a decision-support prototype and not a diagnosis.', escalation_required: false };
};

router.post('/', authMiddleware, async (req, res) => {
  try {
    const { patient_id, symptoms, age, vitals } = req.body;

    if (!patient_id || !symptoms) {
      return res.status(400).json({ message: 'patient_id and symptoms are required.' });
    }

    const evaluation = assessRisk(symptoms, age);

    const result = await query(
      `INSERT INTO triage_assessments (patient_id, symptoms, age, vitals, risk_level, recommendation, escalation_required)
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [patient_id, symptoms, age || null, vitals || null, evaluation.risk_level, evaluation.recommendation, evaluation.escalation_required],
    );

    res.status(201).json({
      assessment: result.rows[0],
      risk_level: evaluation.risk_level,
      recommendation: evaluation.recommendation,
      escalation_required: evaluation.escalation_required,
      note: 'This is an AI/decision-support prototype only and does not replace a doctor.',
    });
  } catch (error) {
    res.status(500).json({ message: 'Triage assessment failed', error: error.message });
  }
});

module.exports = router;
