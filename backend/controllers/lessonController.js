const Lesson = require('../models/Lesson');
const Course = require('../models/Course');
const Progress = require('../models/Progress');
const { validationResult } = require('express-validator');

// @desc    Get lessons for a course
// @route   GET /api/lessons/course/:courseId
// @access  Private
exports.getCourseLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId })
      .populate('instructor', 'name avatar')
      .sort({ order: 1 });

    res.status(200).json({
      success: true,
      count: lessons.length,
      data: lessons
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single lesson
// @route   GET /api/lessons/:id
// @access  Private
exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id)
      .populate('course', 'title instructor')
      .populate('instructor', 'name avatar');

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    res.status(200).json({
      success: true,
      data: lesson
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create lesson
// @route   POST /api/lessons
// @access  Private/Instructor
exports.createLesson = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Check if course exists and user owns it
    const course = await Course.findById(req.body.course);
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to add lessons to this course'
      });
    }

    req.body.instructor = req.user.id;

    const lesson = await Lesson.create(req.body);

    // Add lesson to course
    await Course.findByIdAndUpdate(req.body.course, {
      $push: { lessons: lesson._id },
      $inc: { totalLessons: 1 }
    });

    res.status(201).json({
      success: true,
      message: 'Lesson created successfully',
      data: lesson
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update lesson
// @route   PUT /api/lessons/:id
// @access  Private/Instructor
exports.updateLesson = async (req, res) => {
  try {
    let lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Check ownership
    if (lesson.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this lesson'
      });
    }

    lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Lesson updated successfully',
      data: lesson
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Mark lesson as completed
// @route   POST /api/lessons/:id/complete
// @access  Private/Student
exports.completeLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);

    if (!lesson) {
      return res.status(404).json({
        success: false,
        message: 'Lesson not found'
      });
    }

    // Create or update progress
    let progress = await Progress.findOne({
      user: req.user.id,
      lesson: req.params.id,
      course: lesson.course
    });

    if (progress) {
      progress.isCompleted = true;
      progress.completedAt = new Date();
    } else {
      progress = await Progress.create({
        user: req.user.id,
        lesson: req.params.id,
        course: lesson.course,
        isCompleted: true,
        completedAt: new Date()
      });
    }

    await progress.save();

    // Update course progress
    const courseProgress = await Progress.calculateCourseProgress(req.user.id, lesson.course);

    // Update user's course progress
    await User.findOneAndUpdate(
      { 
        _id: req.user.id,
        'enrolledCourses.courseId': lesson.course
      },
      {
        $set: { 'enrolledCourses.$.progress': courseProgress }
      }
    );

    res.status(200).json({
      success: true,
      message: 'Lesson marked as completed',
      courseProgress
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};