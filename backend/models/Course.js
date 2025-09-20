const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a course title'],
    trim: true,
    maxlength: [100, 'Course title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please provide a course description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  shortDescription: {
    type: String,
    maxlength: [200, 'Short description cannot be more than 200 characters']
  },
  instructor: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Course must have an instructor']
  },
  category: {
    type: String,
    required: [true, 'Please specify a category'],
    enum: ['Programming', 'Design', 'Business', 'Marketing', 'Data Science', 'Mobile Development', 'Web Development', 'DevOps', 'Cybersecurity', 'AI/ML', 'Other']
  },
  level: {
    type: String,
    required: [true, 'Please specify course level'],
    enum: ['Beginner', 'Intermediate', 'Advanced']
  },
  price: {
    type: Number,
    required: [true, 'Please provide a price'],
    min: [0, 'Price cannot be negative']
  },
  discountPrice: {
    type: Number,
    min: [0, 'Discount price cannot be negative']
  },
  thumbnail: {
    type: String,
    default: 'https://via.placeholder.com/400x225/0D8ABC/FFFFFF?text=Course+Thumbnail'
  },
  duration: {
    hours: { type: Number, default: 0 },
    minutes: { type: Number, default: 0 }
  },
  language: { type: String, default: 'English' },
  lessons: [{ type: mongoose.Schema.ObjectId, ref: 'Lesson' }],
  totalLessons: { type: Number, default: 0 },
  requirements: [String],
  learningOutcomes: [String],
  studentsEnrolled: { type: Number, default: 0 },
  studentsCompleted: { type: Number, default: 0 },
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  reviews: [{
    user: { type: mongoose.Schema.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, maxlength: 500 },
    createdAt: { type: Date, default: Date.now }
  }],
  status: {
    type: String,
    enum: ['draft', 'pending', 'published', 'archived'],
    default: 'draft'
  },
  isPublished: { type: Boolean, default: false },
  publishedAt: Date,
  slug: { type: String, unique: true },
  tags: [String],
  views: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes
courseSchema.index({ title: 'text', description: 'text' });
courseSchema.index({ instructor: 1 });
courseSchema.index({ category: 1 });

// Virtual for formatted duration
courseSchema.virtual('formattedDuration').get(function() {
  const hours = this.duration.hours;
  const minutes = this.duration.minutes;
  if (hours === 0) return `${minutes} minutes`;
  if (minutes === 0) return `${hours} hour${hours > 1 ? 's' : ''}`;
  return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
});

module.exports = mongoose.model('Course', courseSchema);