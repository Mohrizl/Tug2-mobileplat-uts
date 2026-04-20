const router = require('express').Router();
const { body } = require('express-validator');
const { getNotes, getNoteById, createNote, updateNote, deleteNote, togglePin } = require('../controllers/notesController');
const { authenticate } = require('../middleware/auth');
const validate = require('../middleware/validate');

router.use(authenticate);

router.get('/', getNotes);
router.get('/:id', getNoteById);

router.post('/',
  [
    body('title').trim().notEmpty().withMessage('Title is required').isLength({ max: 255 }),
    body('color').optional().isHexColor().withMessage('Invalid color format'),
  ],
  validate,
  createNote
);

router.put('/:id',
  [
    body('title').optional().trim().notEmpty().isLength({ max: 255 }),
    body('color').optional().isHexColor(),
  ],
  validate,
  updateNote
);

router.delete('/:id', deleteNote);
router.patch('/:id/pin', togglePin);

module.exports = router;
