const mongoose = require('mongoose');

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Progress must belong to a user']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Progress must belong to a course']
  },
  lesson: {
    type: mongoose.Schema.ObjectId,
    ref: 'Lesson',
    required: [true, 'Progress must belong to a lesson']
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  completedAt: {
    type: Date
  },
  watchTime: {
    type: Number, // in seconds
    default: 0
  },
  lastWatchedAt: {
    type: Date,
    default: Date.now
  },
  quizScore: {
    type: Number,
    min: 0,
    max: 100
  },
  notes: {
    type: String,
    maxlength: [1000, 'Notes cannot be more than 1000 characters']
  },
  bookmarks: [{
    timestamp: Number, // in seconds
    note: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, {
  timestamps: true
});

// Compound indexes
progressSchema.index({ user: 1, course: 1 });
progressSchema.index({ user: 1, lesson: 1 }, { unique: true });

// Static method to calculate course progress
progressSchema.statics.calculateCourseProgress = async function(userId, courseId) {
  const totalLessons = await this.model('Lesson').countDocuments({ course: courseId });
  const completedLessons = await this.countDocuments({ 
    user: userId, 
    course: courseId, 
    isCompleted: true 
  });

  return totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
};

module.exports = mongoose.model('Progress', progressSchema);