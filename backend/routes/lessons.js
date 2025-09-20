// COMPLETE backend/routes/lessons.js - FIXED VERSION
const express = require('express');
const router = express.Router();

const {
  createLesson,
  getCourseLessons,
  getLesson,
  updateLesson,
  deleteLesson,
  completeLesson,
  updateLessonProgress
} = require('../controllers/lessonController');

const { protect, authorize } = require('../middleware/auth');

// Instructor routes
router.post('/', protect, authorize('instructor', 'admin'), createLesson);
router.put('/:id', protect, authorize('instructor', 'admin'), updateLesson);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteLesson);

// Student and instructor routes
router.get('/course/:courseId', protect, getCourseLessons);
router.get('/:id', protect, getLesson);

// Student routes
router.post('/:id/complete', protect, authorize('student'), completeLesson);

// Remove this problematic line if you don't have updateLessonProgress function
// router.put('/:id/progress', protect, authorize('student'), updateLessonProgress);

module.exports = router;