const Lesson = require('../models/Lesson');
const Course = require('../models/Course');

exports.createLesson = async (req, res) => {
  try {
    const lesson = await Lesson.create({
      ...req.body,
      instructor: req.user.id
    });
    res.status(201).json({ success: true, data: lesson });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.getCourseLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find({ course: req.params.courseId });
    res.status(200).json({ success: true, data: lessons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findById(req.params.id);
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateLesson = async (req, res) => {
  try {
    const lesson = await Lesson.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: lesson });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

exports.deleteLesson = async (req, res) => {
  try {
    await Lesson.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.completeLesson = async (req, res) => {
  try {
    res.status(200).json({ success: true, message: 'Lesson completed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
