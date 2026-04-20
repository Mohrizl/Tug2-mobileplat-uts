const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, refresh, logout, me } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');

const validate = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};

router.post('/register', [
  body('name').trim().notEmpty().withMessage('Name is required').isLength({ min: 2, max: 100 }),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate,
], register);

router.post('/login', [
  body('email').isEmail().normalizeEmail(),
  body('password').notEmpty(),
  validate,
], login);

router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/me', authenticateToken, me);

module.exports = router;
