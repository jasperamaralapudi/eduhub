const express = require('express');
const { body } = require('express-validator');
const {
  getCourseLessons,
  getLesson,
  createLesson,
  updateLesson,
  completeLesson
} = require('../controllers/lessonController');
const { protect } = require('../middleware/auth');
const { authorize } = require('../middleware/roleCheck');

const router = express.Router();

// Validation rules
const lessonValidation = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  body('course')
    .isMongoId()
    .withMessage('Please provide a valid course ID'),
  body('order')
    .isInt({ min: 1 })
    .withMessage('Order must be a positive integer'),
  body('duration')
    .isInt({ min: 1 })
    .withMessage('Duration must be a positive integer (minutes)'),
  body('videoUrl')
    .notEmpty()
    .withMessage('Video URL is required')
];

// Protected routes
router.use(protect);

router.get('/course/:courseId', getCourseLessons);
router.get('/:id', getLesson);
router.post('/', authorize('instructor', 'admin'), lessonValidation, createLesson);
router.put('/:id', authorize('instructor', 'admin'), updateLesson);
router.post('/:id/complete', authorize('student'), completeLesson);

module.exports = router;