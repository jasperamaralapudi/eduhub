const express = require('express');
const router = express.Router();

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollCourse,
  unenrollCourse,
  getMyCourses,
  updateProgress
} = require('../controllers/courseController');

const { protect, authorize } = require('../middleware/auth');

// Public routes
router.get('/', getCourses);

// Protected specific routes (must come before /:id)
router.get('/my-courses', protect, authorize('student'), getMyCourses);

// Public dynamic routes
router.get('/:id', getCourse);

// Protected course management routes
router.post('/', protect, authorize('instructor', 'admin'), createCourse);
router.put('/:id', protect, authorize('instructor', 'admin'), updateCourse);
router.delete('/:id', protect, authorize('instructor', 'admin'), deleteCourse);

// Student enrollment routes
router.post('/:id/enroll', protect, authorize('student'), enrollCourse);
router.post('/:id/unenroll', protect, authorize('student'), unenrollCourse);
router.put('/:id/progress', protect, authorize('student'), updateProgress);

module.exports = router;