const mongoose = require('mongoose');

const lessonSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a lesson title'],
    trim: true,
    maxlength: [100, 'Lesson title cannot be more than 100 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  course: {
    type: mongoose.Schema.ObjectId,
    ref: 'Course',
    required: [true, 'Lesson must belong to a course']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Lesson must have an instructor']
  },
  order: {
    type: Number,
    required: [true, 'Lesson order is required']
  },
  duration: {
    type: Number, // Duration in minutes
    required: [true, 'Please provide lesson duration']
  },
  videoUrl: {
    type: String,
    required: [true, 'Please provide video URL']
  },
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['pdf', 'link', 'file'] }
  }],
  quiz: [{
    question: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctAnswer: { type: Number, required: true },
    explanation: String
  }],
  isPreview: {
    type: Boolean,
    default: false
  },
  isPublished: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Indexes
lessonSchema.index({ course: 1, order: 1 });
lessonSchema.index({ instructor: 1 });

module.exports = mongoose.model('Lesson', lessonSchema);