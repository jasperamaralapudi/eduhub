const Course = require('../models/Course');
const User = require('../models/User');
const Progress = require('../models/Progress');
const { validationResult } = require('express-validator');

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res) => {
  try {
    const { page = 1, limit = 12, category, level, search, sort = '-createdAt' } = req.query;

    let query = { status: 'published' };

    if (category && category !== 'all') query.category = category;
    if (level && level !== 'all') query.level = level;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const courses = await Course.find(query)
      .populate('instructor', 'name avatar rating')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort(sort);

    const total = await Course.countDocuments(query);

    res.status(200).json({
      success: true,
      count: courses.length,
      total,
      pages: Math.ceil(total / limit),
      data: courses
    });
  } catch (error) {
    console.error('Get courses error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get single course
// @route   GET /api/courses/:id
// @access  Public
exports.getCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate('instructor', 'name avatar bio rating totalStudents')
      .populate('lessons')
      .populate('reviews.user', 'name avatar');

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Increment views
    await Course.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

    res.status(200).json({
      success: true,
      data: course
    });
  } catch (error) {
    console.error('Get course error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private/Instructor
exports.createCourse = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: errors.array()
      });
    }

    // Add instructor ID to course data
    req.body.instructor = req.user.id;
    
    // Set default values
    req.body.status = 'draft';
    req.body.isPublished = false;
    req.body.studentsEnrolled = 0;
    req.body.rating = { average: 0, count: 0 };
    req.body.createdAt = new Date();
    req.body.updatedAt = new Date();

    const course = await Course.create(req.body);

    // Add course to instructor's created courses
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: course._id }
    });

    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (error) {
    console.error('Create course error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Instructor
exports.updateCourse = async (req, res) => {
  try {
    let course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this course'
      });
    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      message: 'Course updated successfully',
      data: course
    });
  } catch (error) {
    console.error('Update course error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Instructor
exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this course'
      });
    }

    await Course.findByIdAndDelete(req.params.id);

    // Remove from instructor's created courses
    await User.findByIdAndUpdate(course.instructor, {
      $pull: { createdCourses: req.params.id }
    });

    // Remove from all users' enrolled courses
    await User.updateMany(
      { 'enrolledCourses.courseId': req.params.id },
      { $pull: { enrolledCourses: { courseId: req.params.id } } }
    );

    // Delete all progress records for this course
    await Progress.deleteMany({ course: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Course deleted successfully'
    });
  } catch (error) {
    console.error('Delete course error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Enroll in course
// @route   POST /api/courses/:id/enroll
// @access  Private/Student
exports.enrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    const user = await User.findById(req.user.id);

    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(
      enrollment => enrollment.courseId.toString() === req.params.id
    );

    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        message: 'Already enrolled in this course'
      });
    }

    // Add to user's enrolled courses
    user.enrolledCourses.push({
      courseId: req.params.id,
      enrolledAt: new Date(),
      progress: 0
    });

    await user.save();

    // Increment course enrollment count
    await Course.findByIdAndUpdate(req.params.id, {
      $inc: { studentsEnrolled: 1 }
    });

    res.status(200).json({
      success: true,
      message: 'Successfully enrolled in course'
    });
  } catch (error) {
    console.error('Enroll error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Unenroll from course
// @route   POST /api/courses/:id/unenroll
// @access  Private/Student
exports.unenrollCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    
    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }
    
    const user = await User.findById(req.user.id);
    
    // Check if user is enrolled
    const enrollmentIndex = user.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === req.params.id
    );
    
    if (enrollmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }
    
    // Remove from user's enrolled courses
    user.enrolledCourses.splice(enrollmentIndex, 1);
    await user.save();
    
    // Decrement course enrollment count
    await Course.findByIdAndUpdate(req.params.id, {
      $inc: { studentsEnrolled: -1 }
    });
    
    // Remove user progress for this course
    await Progress.deleteMany({
      user: req.user.id,
      course: req.params.id
    });
    
    res.status(200).json({
      success: true,
      message: 'Successfully unenrolled from course'
    });
  } catch (error) {
    console.error('Unenroll error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get user's enrolled courses
// @route   GET /api/courses/my-courses
// @access  Private/Student
exports.getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .populate({
        path: 'enrolledCourses.courseId',
        populate: {
          path: 'instructor',
          select: 'name avatar'
        }
      });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }
    
    // Filter out any null course references (in case course was deleted)
    const validEnrollments = user.enrolledCourses.filter(enrollment => enrollment.courseId);
    
    // Format the response with enrollment details
    const enrolledCourses = validEnrollments.map(enrollment => ({
      ...enrollment.courseId.toObject(),
      enrollmentDate: enrollment.enrolledAt,
      progress: enrollment.progress || 0,
      isCompleted: enrollment.progress === 100
    }));
    
    res.status(200).json({
      success: true,
      count: enrolledCourses.length,
      data: enrolledCourses
    });
  } catch (error) {
    console.error('Get my courses error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get instructor's courses
// @route   GET /api/courses/instructor/my-courses
// @access  Private/Instructor
exports.getInstructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.user.id })
      .populate('instructor', 'name avatar')
      .sort('-createdAt');

    // Get enrollment stats for each course
    const coursesWithStats = await Promise.all(
      courses.map(async (course) => {
        const enrolledStudents = await User.countDocuments({
          'enrolledCourses.courseId': course._id
        });

        const completedStudents = await User.countDocuments({
          'enrolledCourses.courseId': course._id,
          'enrolledCourses.progress': 100
        });

        return {
          ...course.toObject(),
          enrollmentStats: {
            enrolled: enrolledStudents,
            completed: completedStudents,
            completionRate: enrolledStudents > 0 ? Math.round((completedStudents / enrolledStudents) * 100) : 0
          }
        };
      })
    );

    res.status(200).json({
      success: true,
      count: courses.length,
      data: coursesWithStats
    });
  } catch (error) {
    console.error('Get instructor courses error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get course analytics for instructor
// @route   GET /api/courses/:id/analytics
// @access  Private/Instructor
exports.getCourseAnalytics = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view course analytics'
      });
    }

    // Get enrolled students with their progress
    const enrolledStudents = await User.find({
      'enrolledCourses.courseId': req.params.id
    }).select('name email avatar enrolledCourses');

    const studentsData = enrolledStudents.map(student => {
      const enrollment = student.enrolledCourses.find(
        e => e.courseId.toString() === req.params.id
      );
      return {
        _id: student._id,
        name: student.name,
        email: student.email,
        avatar: student.avatar,
        enrolledAt: enrollment.enrolledAt,
        progress: enrollment.progress || 0,
        isCompleted: enrollment.progress === 100
      };
    });

    // Calculate analytics
    const totalStudents = studentsData.length;
    const completedStudents = studentsData.filter(s => s.isCompleted).length;
    const averageProgress = totalStudents > 0 
      ? Math.round(studentsData.reduce((sum, s) => sum + s.progress, 0) / totalStudents)
      : 0;

    // Progress distribution
    const progressRanges = {
      '0-25': studentsData.filter(s => s.progress >= 0 && s.progress < 25).length,
      '25-50': studentsData.filter(s => s.progress >= 25 && s.progress < 50).length,
      '50-75': studentsData.filter(s => s.progress >= 50 && s.progress < 75).length,
      '75-100': studentsData.filter(s => s.progress >= 75 && s.progress <= 100).length,
    };

    res.status(200).json({
      success: true,
      data: {
        course: {
          title: course.title,
          createdAt: course.createdAt,
          lastUpdated: course.updatedAt,
          totalLessons: course.totalLessons || 0,
          rating: course.rating
        },
        stats: {
          totalStudents,
          completedStudents,
          completionRate: totalStudents > 0 ? Math.round((completedStudents / totalStudents) * 100) : 0,
          averageProgress
        },
        progressDistribution: progressRanges,
        students: studentsData,
        recentEnrollments: studentsData
          .sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt))
          .slice(0, 10)
      }
    });
  } catch (error) {
    console.error('Get course analytics error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Publish/Unpublish course
// @route   PUT /api/courses/:id/publish
// @access  Private/Instructor
exports.toggleCoursePublication = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({
        success: false,
        message: 'Course not found'
      });
    }

    // Check ownership
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to publish this course'
      });
    }

    // Toggle publication status
    const isPublished = !course.isPublished;
    const status = isPublished ? 'published' : 'draft';

    const updatedCourse = await Course.findByIdAndUpdate(
      req.params.id,
      { 
        isPublished,
        status,
        publishedAt: isPublished ? new Date() : null,
        updatedAt: new Date()
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: `Course ${isPublished ? 'published' : 'unpublished'} successfully`,
      data: updatedCourse
    });
  } catch (error) {
    console.error('Toggle publication error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Get instructor dashboard stats
// @route   GET /api/courses/instructor/stats
// @access  Private/Instructor
exports.getInstructorStats = async (req, res) => {
  try {
    // Get instructor's courses
    const courses = await Course.find({ instructor: req.user.id });
    const courseIds = courses.map(course => course._id);

    // Calculate stats
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    
    // Get total students across all courses
    const enrollments = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $match: { 'enrolledCourses.courseId': { $in: courseIds } } },
      { $group: { _id: null, totalStudents: { $sum: 1 } } }
    ]);

    const totalStudents = enrollments.length > 0 ? enrollments[0].totalStudents : 0;

    // Get completed enrollments
    const completedEnrollments = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $match: { 
        'enrolledCourses.courseId': { $in: courseIds },
        'enrolledCourses.progress': 100 
      } },
      { $group: { _id: null, completedStudents: { $sum: 1 } } }
    ]);

    const completedStudents = completedEnrollments.length > 0 ? completedEnrollments[0].completedStudents : 0;

    // Calculate average rating
    const avgRating = courses.length > 0 
      ? courses.reduce((sum, course) => sum + (course.rating?.average || 0), 0) / courses.length
      : 0;

    // Recent enrollments
    const recentEnrollments = await User.aggregate([
      { $unwind: '$enrolledCourses' },
      { $match: { 'enrolledCourses.courseId': { $in: courseIds } } },
      { $sort: { 'enrolledCourses.enrolledAt': -1 } },
      { $limit: 10 },
      {
        $lookup: {
          from: 'courses',
          localField: 'enrolledCourses.courseId',
          foreignField: '_id',
          as: 'course'
        }
      },
      {
        $project: {
          name: 1,
          email: 1,
          avatar: 1,
          enrolledAt: '$enrolledCourses.enrolledAt',
          progress: '$enrolledCourses.progress',
          courseName: { $arrayElemAt: ['$course.title', 0] }
        }
      }
    ]);

    res.status(200).json({
      success: true,
      data: {
        stats: {
          totalCourses,
          publishedCourses,
          totalStudents,
          completedStudents,
          averageRating: Math.round(avgRating * 10) / 10
        },
        recentEnrollments
      }
    });
  } catch (error) {
    console.error('Get instructor stats error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Update progress
// @route   PUT /api/courses/:id/progress
// @access  Private/Student
exports.updateProgress = async (req, res) => {
  try {
    const { progress } = req.body;

    if (progress < 0 || progress > 100) {
      return res.status(400).json({
        success: false,
        message: 'Progress must be between 0 and 100'
      });
    }

    const user = await User.findById(req.user.id);
    
    // Find the enrolled course
    const enrollmentIndex = user.enrolledCourses.findIndex(
      enrollment => enrollment.courseId.toString() === req.params.id
    );

    if (enrollmentIndex === -1) {
      return res.status(400).json({
        success: false,
        message: 'You are not enrolled in this course'
      });
    }

    // Update progress
    user.enrolledCourses[enrollmentIndex].progress = progress;

    // If completed (100%), add to completed courses
    if (progress === 100) {
      const alreadyCompleted = user.completedCourses.includes(req.params.id);
      if (!alreadyCompleted) {
        user.completedCourses.push(req.params.id);
      }
    } else {
      // If not completed, remove from completed courses
      user.completedCourses = user.completedCourses.filter(
        courseId => courseId.toString() !== req.params.id
      );
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Progress updated successfully',
      data: { progress }
    });
  } catch (error) {
    console.error('Update progress error:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};