import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import { formatCurrency, formatDate, calculateProgress } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Dashboard.css';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unenrolling, setUnenrolling] = useState({});

  useEffect(() => {
    fetchEnrolledCourses();
  }, []);

  const fetchEnrolledCourses = async () => {
    try {
      setLoading(true);
      const response = await api.get('/courses/my-courses');
      setEnrolledCourses(response.data.data || []);
    } catch (error) {
      console.error('Failed to fetch enrolled courses:', error);
      toast.error('Failed to load your courses');
    } finally {
      setLoading(false);
    }
  };

  const handleUnenroll = async (courseId, courseTitle) => {
    if (!window.confirm(`Are you sure you want to unenroll from "${courseTitle}"? This will remove all your progress.`)) {
      return;
    }

    try {
      setUnenrolling(prev => ({ ...prev, [courseId]: true }));
      
      const response = await api.post(`/courses/${courseId}/unenroll`);
      
      if (response.data.success) {
        toast.success('Successfully unenrolled from course');
        // Remove course from local state
        setEnrolledCourses(prev => prev.filter(course => course._id !== courseId));
      }
    } catch (error) {
      console.error('Unenroll error:', error);
      toast.error(error.response?.data?.message || 'Failed to unenroll from course');
    } finally {
      setUnenrolling(prev => ({ ...prev, [courseId]: false }));
    }
  };

  const stats = {
    totalEnrolled: enrolledCourses.length,
    inProgress: enrolledCourses.filter(course => course.progress > 0 && course.progress < 100).length,
    completed: enrolledCourses.filter(course => course.progress === 100).length,
    averageProgress: enrolledCourses.length > 0 
      ? Math.round(enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / enrolledCourses.length)
      : 0
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="container">
          <div className="flex-center" style={{ minHeight: '400px' }}>
            <LoadingSpinner size="large" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Welcome back, {user?.name}!</h1>
          <p>Continue your learning journey</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.totalEnrolled}</h3>
            <p>Enrolled Courses</p>
          </div>
          
          <div className="stat-card">
            <h3>{stats.inProgress}</h3>
            <p>In Progress</p>
          </div>
          
          <div className="stat-card">
            <h3>{stats.completed}</h3>
            <p>Completed</p>
          </div>
          
          <div className="stat-card">
            <h3>{stats.averageProgress}%</h3>
            <p>Avg. Progress</p>
          </div>
        </div>

        <section className="dashboard-section">
          <div className="section-header">
            <h2>My Enrolled Courses</h2>
            <Link to="/courses" className="btn btn-primary">
              Browse More Courses
            </Link>
          </div>

          {enrolledCourses.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📚</div>
              <h3>No courses enrolled yet</h3>
              <p>Start your learning journey by enrolling in courses that interest you.</p>
              <Link to="/courses" className="btn btn-primary">
                Browse Courses
              </Link>
            </div>
          ) : (
            <div className="enrolled-courses">
              {enrolledCourses.map(course => (
                <div key={course._id} className="enrolled-course-card">
                  <div className="course-image">
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="progress-overlay">
                      <div className="progress-circle">
                        <span>{course.progress || 0}%</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="course-info">
                    <div className="course-header">
                      <h3 className="course-title">{course.title}</h3>
                      <div className="course-badges">
                        <span className={`badge ${course.isCompleted ? 'badge-success' : 'badge-primary'}`}>
                          {course.isCompleted ? 'Completed' : 'In Progress'}
                        </span>
                        <span className="badge badge-secondary">{course.level}</span>
                      </div>
                    </div>
                    
                    <p className="course-instructor">
                      by {course.instructor?.name || 'Unknown Instructor'}
                    </p>
                    
                    <div className="progress-bar">
                      <div 
                        className="progress-bar-fill" 
                        style={{ width: `${course.progress || 0}%` }}
                      />
                    </div>
                    <p className="progress-text">
                      {course.progress || 0}% Complete
                    </p>
                    
                    <div className="course-meta">
                      <span className="enrolled-date">
                        📅 Enrolled: {formatDate(course.enrollmentDate)}
                      </span>
                      <span className="course-duration">
                        🕐 {course.duration?.hours || 0}h {course.duration?.minutes || 0}m
                      </span>
                    </div>
                    
                    <div className="course-actions">
                      <Link 
                        to={`/courses/${course._id}`}
                        className="btn btn-primary"
                      >
                        {course.progress > 0 ? 'Continue Learning' : 'Start Course'}
                      </Link>
                      
                      <button
                        onClick={() => handleUnenroll(course._id, course.title)}
                        className="btn btn-outline btn-danger"
                        disabled={unenrolling[course._id]}
                      >
                        {unenrolling[course._id] ? (
                          <>
                            <LoadingSpinner size="small" />
                            Unenrolling...
                          </>
                        ) : (
                          'Unenroll'
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {enrolledCourses.length > 0 && (
          <section className="dashboard-section">
            <h2>Continue Learning</h2>
            <div className="quick-access">
              {enrolledCourses
                .filter(course => course.progress > 0 && course.progress < 100)
                .slice(0, 3)
                .map(course => (
                  <Link 
                    key={course._id}
                    to={`/courses/${course._id}`}
                    className="quick-course-card"
                  >
                    <img src={course.thumbnail} alt={course.title} />
                    <div className="quick-course-info">
                      <h4>{course.title}</h4>
                      <div className="quick-progress">
                        <div 
                          className="quick-progress-bar"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                      <span>{course.progress}% Complete</span>
                    </div>
                  </Link>
                ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;