const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { query } = require('../db/database');
const { authMiddleware } = require('../middleware/authMiddleware');

const router = express.Router();

const generateToken = (user) => jwt.sign({ userId: user.id, role: user.role }, process.env.JWT_SECRET || 'change_this_secret_key', { expiresIn: '7d' });

const normalizeRole = (role) => {
  const value = String(role || '').toLowerCase();
  if (['patient', 'doctor', 'health_worker', 'admin', 'facility'].includes(value)) return value;
  return 'patient';
};

router.post('/register/patient', async (req, res) => {
  try {
    const { name, email, phone, password, age, gender, village, district, emergency_contact } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1 OR phone = $2', [email || null, phone]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userResult = await query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
      [name, email || null, phone, password_hash, 'patient'],
    );

    const user = userResult.rows[0];
    const patientId = `PAT-${Date.now()}`;
    await query(
      'INSERT INTO patients (user_id, patient_id, age, gender, village, district, emergency_contact) VALUES ($1, $2, $3, $4, $5, $6, $7)',
      [user.id, patientId, age || null, gender || null, village || null, district || null, emergency_contact || null],
    );

    res.status(201).json({
      message: 'Patient registered successfully',
      user: { ...user, role: 'patient' },
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Registration failed', error: error.message });
  }
});

router.post('/register/doctor', async (req, res) => {
  try {
    const { name, email, phone, password, specialty, degree, facility_id } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1 OR phone = $2', [email || null, phone]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Doctor already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userResult = await query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
      [name, email || null, phone, password_hash, 'doctor'],
    );

    const user = userResult.rows[0];
    const doctorId = `DOC-${Date.now()}`;
    await query(
      'INSERT INTO doctors (user_id, doctor_id, specialty, degree, facility_id) VALUES ($1, $2, $3, $4, $5)',
      [user.id, doctorId, specialty || null, degree || null, facility_id || null],
    );

    res.status(201).json({
      message: 'Doctor registered successfully',
      user: { ...user, role: 'doctor' },
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Doctor registration failed', error: error.message });
  }
});

router.post('/register/health-worker', async (req, res) => {
  try {
    const { name, email, phone, password, designation, facility_id } = req.body;

    if (!name || !phone || !password) {
      return res.status(400).json({ message: 'Name, phone and password are required.' });
    }

    const existing = await query('SELECT id FROM users WHERE email = $1 OR phone = $2', [email || null, phone]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'Health worker already exists.' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userResult = await query(
      'INSERT INTO users (name, email, phone, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, email, phone, role',
      [name, email || null, phone, password_hash, 'health_worker'],
    );

    const user = userResult.rows[0];
    const workerId = `HW-${Date.now()}`;
    await query(
      'INSERT INTO health_workers (user_id, worker_id, designation, facility_id) VALUES ($1, $2, $3, $4)',
      [user.id, workerId, designation || null, facility_id || null],
    );

    res.status(201).json({
      message: 'Health worker registered successfully',
      user: { ...user, role: 'health_worker' },
      token: generateToken(user),
    });
  } catch (error) {
    res.status(500).json({ message: 'Health worker registration failed', error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if (!password || (!email && !phone)) {
      return res.status(400).json({ message: 'Email or phone and password are required.' });
    }

    const result = await query(
      'SELECT * FROM users WHERE email = $1 OR phone = $2 LIMIT 1',
      [email || null, phone || null],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);

    if (!validPassword) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Login failed', error: error.message });
  }
});

router.get('/me', authMiddleware, async (req, res) => {
  res.json({ user: req.user });
});

module.exports = router;
