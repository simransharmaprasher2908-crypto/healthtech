const jwt = require('jsonwebtoken');
const { query } = require('../db/database');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized. Token missing.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'change_this_secret_key');

    const result = await query(
      'SELECT id, email, phone, role, name FROM users WHERE id = $1',
      [decoded.userId],
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ message: 'User not found.' });
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

const authorize = (...roles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Unauthorized.' });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied for this role.' });
  }

  next();
};

module.exports = { authMiddleware, authorize };
