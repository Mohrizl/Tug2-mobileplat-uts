const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { getAllNotes, getNoteById, createNote, updateNote, deleteNote, togglePin, getStats } = require('../controllers/notesController');

const validate = (req, res, next) => {
  const { validationResult } = require('express-validator');
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  next();
};

// All routes protected
router.use(authenticateToken);

router.get('/stats', getStats);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);

router.post('/', [
  body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
  body('content').optional().isString(),
  body('category').optional().isString().isLength({ max: 50 }),
  body('color').optional().isString(),
  body('tags').optional().isArray(),
  validate,
], createNote);

router.put('/:id', [
  body('title').optional().trim().notEmpty().isLength({ max: 255 }),
  body('content').optional().isString(),
  body('category').optional().isString().isLength({ max: 50 }),
  validate,
], updateNote);

router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePin);

module.exports = router;
