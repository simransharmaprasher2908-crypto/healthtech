require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { query } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 5000;

const authRoutes = require('./routes/authRoutes');
const patientRoutes = require('./routes/patientRoutes');
const facilityRoutes = require('./routes/facilityRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const triageRoutes = require('./routes/triageRoutes');
const medicalRecordRoutes = require('./routes/medicalRecordRoutes');
const referralRoutes = require('./routes/referralRoutes');
const medicineRoutes = require('./routes/medicineRoutes');
const diagnosticRoutes = require('./routes/diagnosticRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/facilities', facilityRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/triage', triageRoutes);
app.use('/api/medical-records', medicalRecordRoutes);
app.use('/api/referrals', referralRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/diagnostics', diagnosticRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

app.listen(PORT, async () => {
  try {
    await query('SELECT 1');
    console.log(`Backend running on http://localhost:${PORT}`);
  } catch (error) {
    console.error('Database connection check failed:', error.message);
    console.log(`Backend running on http://localhost:${PORT} (DB not connected yet)`);
  }
});
