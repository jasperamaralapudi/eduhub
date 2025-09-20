import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useCourse } from '../../context/CourseContext';
import { useAuth } from '../../context/AuthContext';
import { formatCurrency } from '../../utils/helpers';
import LoadingSpinner from '../UI/LoadingSpinner';
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  const { currentCourse, isLoading, fetchCourse, enrollCourse } = useCourse();
  const { isAuthenticated, user } = useAuth();
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    fetchCourse(id);
  }, [id]);

  const handleEnroll = async () => {
    setEnrolling(true);
    const result = await enrollCourse(id);
    if (result.success) {
      // Refresh course data
      fetchCourse(id);
    }
    setEnrolling(false);
  };

  if (isLoading || !currentCourse) {
    return (
      <div className="flex-center" style={{ minHeight: '400px' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses?.some(
    enrollment => enrollment.courseId === id
  );

  return (
    <div className="course-detail">
      <div className="course-hero">
        <div className="container">
          <div className="course-hero-content">
            <div className="course-info">
              <div className="course-category">{currentCourse.category}</div>
              <h1 className="course-title">{currentCourse.title}</h1>
              <p className="course-description">{currentCourse.description}</p>

              <div className="course-stats">
                <div className="stat">
                  <span className="stars">
                    {'★'.repeat(Math.floor(currentCourse.rating?.average || 0))}
                  </span>
                  <span>{currentCourse.rating?.average?.toFixed(1) || '0.0'}</span>
                  <span>({currentCourse.rating?.count || 0} reviews)</span>
                </div>

                <div className="stat">
                  👥 {currentCourse.studentsEnrolled} students
                </div>

                <div className="stat">
                  🕐 {currentCourse.formattedDuration}
                </div>

                <div className="stat">
                  📈 {currentCourse.level}
                </div>
              </div>

              <div className="instructor-info">
                <img 
                  src={currentCourse.instructor?.avatar} 
                  alt={currentCourse.instructor?.name}
                  className="instructor-avatar"
                />
                <div>
                  <p>Created by</p>
                  <p className="instructor-name">{currentCourse.instructor?.name}</p>
                </div>
              </div>
            </div>

            <div className="course-sidebar">
              <div className="course-card">
                <img 
                  src={currentCourse.thumbnail} 
                  alt={currentCourse.title}
                  className="course-image"
                />

                <div className="course-price">
                  {currentCourse.discountPrice ? (
                    <>
                      <span className="current-price">{formatCurrency(currentCourse.discountPrice)}</span>
                      <span className="original-price">{formatCurrency(currentCourse.price)}</span>
                    </>
                  ) : (
                    <span className="current-price">{formatCurrency(currentCourse.price)}</span>
                  )}
                </div>

                {isAuthenticated ? (
                  isEnrolled ? (
                    <button className="btn btn-success btn-full" disabled>
                      ✓ Enrolled
                    </button>
                  ) : (
                    <button 
                      className="btn btn-primary btn-full"
                      onClick={handleEnroll}
                      disabled={enrolling}
                    >
                      {enrolling ? <LoadingSpinner size="small" /> : 'Enroll Now'}
                    </button>
                  )
                ) : (
                  <button className="btn btn-primary btn-full">
                    Login to Enroll
                  </button>
                )}

                <div className="course-includes">
                  <h4>This course includes:</h4>
                  <ul>
                    <li>📹 {currentCourse.totalLessons} video lessons</li>
                    <li>📱 Mobile and TV access</li>
                    <li>🏆 Certificate of completion</li>
                    <li>♾️ Full lifetime access</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="container">
          <div className="course-sections">
            <section className="section">
              <h2>What you'll learn</h2>
              <div className="learning-outcomes">
                {currentCourse.learningOutcomes?.map((outcome, index) => (
                  <div key={index} className="outcome-item">
                    ✓ {outcome}
                  </div>
                ))}
              </div>
            </section>

            <section className="section">
              <h2>Course Content</h2>
              <div className="lessons-list">
                {currentCourse.lessons?.map((lesson, index) => (
                  <div key={lesson._id} className="lesson-item">
                    <div className="lesson-info">
                      <span className="lesson-number">{index + 1}</span>
                      <span className="lesson-title">{lesson.title}</span>
                    </div>
                    <span className="lesson-duration">{lesson.duration}min</span>
                  </div>
                ))}
              </div>
            </section>

            {currentCourse.requirements && (
              <section className="section">
                <h2>Requirements</h2>
                <ul className="requirements-list">
                  {currentCourse.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;