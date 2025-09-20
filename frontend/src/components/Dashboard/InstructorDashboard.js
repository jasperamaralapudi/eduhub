import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { formatDate } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';
import CourseCreationModal from './CourseCreationModal';
import LessonManagementModal from './LessonManagementModal';
import './InstructorDashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courseAnalytics, setCourseAnalytics] = useState({});
  const [showAnalytics, setShowAnalytics] = useState(false);

  useEffect(() => {
    fetchInstructorData();
  }, []);

  const fetchInstructorData = async () => {
    try {
      setLoading(true);
      const [statsResponse, coursesResponse] = await Promise.all([
        api.get('/courses/instructor/stats'),
        api.get('/courses/instructor/my-courses')
      ]);

      setStats(statsResponse.data.data.stats || {});
      setCourses(coursesResponse.data.data || []);
    } catch (error) {
      console.error('Failed to fetch instructor data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCourse = async (courseData) => {
    try {
      const response = await api.post('/courses', courseData);
      
      if (response.data.success) {
        toast.success('Course created successfully!');
        setShowCourseModal(false);
        fetchInstructorData();
      }
    } catch (error) {
      console.error('Create course error:', error);
      toast.error(error.response?.data?.message || 'Failed to create course');
    }
  };

  const handlePublishToggle = async (courseId, currentStatus) => {
    try {
      const response = await api.put(`/courses/${courseId}/publish`);
      
      if (response.data.success) {
        toast.success(response.data.message);
        fetchInstructorData();
      }
    } catch (error) {
      console.error('Toggle publish error:', error);
      toast.error(error.response?.data?.message || 'Failed to update course');
    }
  };

  const handleViewAnalytics = async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/analytics`);
      setCourseAnalytics(response.data.data);
      setShowAnalytics(true);
    } catch (error) {
      console.error('Fetch analytics error:', error);
      toast.error('Failed to load course analytics');
    }
  };

  const handleManageLessons = (course) => {
    setSelectedCourse(course);
    setShowLessonModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  if (loading) {
    return (
      <div className="instructor-dashboard">
        <div className="container">
          <div className="flex-center" style={{ minHeight: '400px' }}>
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="instructor-dashboard">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <div>
            <h1>Welcome back, {user?.name}!</h1>
            <p>Manage your courses and track student progress</p>
          </div>
          <button 
            className="btn btn-primary"
            onClick={() => setShowCourseModal(true)}
          >
            <span>➕</span>
            Create New Course
          </button>
        </div>

        {/* Stats Overview */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📚</div>
            <div className="stat-content">
              <h3>{stats.totalCourses || 0}</h3>
              <p>Total Courses</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">✅</div>
            <div className="stat-content">
              <h3>{stats.publishedCourses || 0}</h3>
              <p>Published</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>{stats.totalStudents || 0}</h3>
              <p>Total Students</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🏆</div>
            <div className="stat-content">
              <h3>{stats.completedStudents || 0}</h3>
              <p>Completed</p>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">⭐</div>
            <div className="stat-content">
              <h3>{stats.averageRating || 0}</h3>
              <p>Avg Rating</p>
            </div>
          </div>
        </div>

        {/* Courses Management */}
        <div className="section">
          <div className="section-header">
            <h2>My Courses ({courses.length})</h2>
            <div className="section-actions">
              <select className="filter-select">
                <option value="all">All Courses</option>
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
          </div>

          {courses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses created yet</h3>
              <p>Start by creating your first course to share your knowledge with students.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowCourseModal(true)}
              >
                Create Your First Course
              </button>
            </div>
          ) : (
            <div className="courses-grid">
              {courses.map(course => (
                <div key={course._id} className="instructor-course-card">
                  <div className="course-image">
                    <img 
                      src={course.thumbnail || '/api/placeholder/300/200'} 
                      alt={course.title}
                      onError={(e) => {
                        e.target.src = '/api/placeholder/300/200';
                      }}
                    />
                    <div className="course-status">
                      <span className={`status-badge ${course.isPublished ? 'published' : 'draft'}`}>
                        {course.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="course-content">
                    <h3 className="course-title">{course.title}</h3>
                    <p className="course-description">
                      {course.shortDescription || course.description?.substring(0, 100) + '...'}
                    </p>
                    
                    <div className="course-stats">
                      <div className="stat">
                        <span className="label">Students</span>
                        <span className="value">{course.enrollmentStats?.enrolled || 0}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Completed</span>
                        <span className="value">{course.enrollmentStats?.completed || 0}</span>
                      </div>
                      <div className="stat">
                        <span className="label">Rate</span>
                        <span className="value">{course.enrollmentStats?.completionRate || 0}%</span>
                      </div>
                    </div>
                    
                    <div className="course-meta">
                      <span className="price">{formatCurrency(course.price)}</span>
                      <span className="created">Created {formatDate(course.createdAt)}</span>
                    </div>
                    
                    <div className="course-actions">
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleManageLessons(course)}
                      >
                        📖 Lessons
                      </button>
                      
                      <button 
                        className="btn btn-sm btn-outline"
                        onClick={() => handleViewAnalytics(course._id)}
                      >
                        📊 Analytics
                      </button>
                      
                      <button 
                        className={`btn btn-sm ${course.isPublished ? 'btn-warning' : 'btn-success'}`}
                        onClick={() => handlePublishToggle(course._id, course.isPublished)}
                      >
                        {course.isPublished ? '🚫 Unpublish' : '✅ Publish'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analytics Section */}
        {showAnalytics && courseAnalytics.course && (
          <div className="section">
            <div className="section-header">
              <h2>Course Analytics - {courseAnalytics.course.title}</h2>
              <button 
                className="btn btn-outline btn-sm"
                onClick={() => setShowAnalytics(false)}
              >
                ✕ Close
              </button>
            </div>
            
            <div className="analytics-grid">
              <div className="analytics-card">
                <h4>Progress Distribution</h4>
                <div className="progress-chart">
                  {Object.entries(courseAnalytics.progressDistribution || {}).map(([range, count]) => (
                    <div key={range} className="progress-bar-item">
                      <span className="range">{range}%</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ 
                            width: courseAnalytics.stats.totalStudents > 0 
                              ? `${(count / courseAnalytics.stats.totalStudents) * 100}%` 
                              : '0%'
                          }}
                        />
                      </div>
                      <span className="count">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="analytics-card">
                <h4>Recent Students</h4>
                <div className="students-list">
                  {courseAnalytics.recentEnrollments?.slice(0, 5).map(student => (
                    <div key={student._id} className="student-item">
                      <img 
                        src={student.avatar || '/api/placeholder/40/40'} 
                        alt={student.name}
                        onError={(e) => {
                          e.target.src = '/api/placeholder/40/40';
                        }}
                      />
                      <div className="student-info">
                        <span className="name">{student.name}</span>
                        <span className="progress">{student.progress}% complete</span>
                      </div>
                      <span className="enrolled-date">
                        {formatDate(student.enrolledAt)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Course Creation Modal */}
      {showCourseModal && (
        <CourseCreationModal
          onClose={() => setShowCourseModal(false)}
          onSubmit={handleCreateCourse}
        />
      )}

      {/* Lesson Management Modal */}
      {showLessonModal && selectedCourse && (
        <LessonManagementModal
          course={selectedCourse}
          onClose={() => {
            setShowLessonModal(false);
            setSelectedCourse(null);
          }}
          onLessonUpdate={() => fetchInstructorData()}
        />
      )}
    </div>
  );
};

export default InstructorDashboard;