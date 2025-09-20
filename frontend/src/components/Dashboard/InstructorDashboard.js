import React, { useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCourse } from '../../context/CourseContext';
import CourseCard from '../Course/CourseCard';
import './Dashboard.css';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { courses, fetchCourses } = useCourse();

  useEffect(() => {
    fetchCourses();
  }, []);

  const myCourses = courses.filter(course => 
    user?.createdCourses?.includes(course._id)
  );

  const totalStudents = myCourses.reduce((sum, course) => sum + course.studentsEnrolled, 0);
  const totalRevenue = myCourses.reduce((sum, course) => 
    sum + (course.price * course.studentsEnrolled), 0
  );

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Instructor Dashboard</h1>
          <p>Manage your courses and track your success</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{myCourses.length}</h3>
            <p>Total Courses</p>
          </div>

          <div className="stat-card">
            <h3>{totalStudents}</h3>
            <p>Total Students</p>
          </div>

          <div className="stat-card">
            <h3>${totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>

          <div className="stat-card">
            <h3>{user?.rating?.toFixed(1) || '0.0'}</h3>
            <p>Avg. Rating</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-primary">Create New Course</button>
          <button className="btn btn-outline">View Analytics</button>
        </div>

        <section className="dashboard-section">
          <h2>My Courses</h2>
          {myCourses.length > 0 ? (
            <div className="courses-grid">
              {myCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <p>You haven't created any courses yet.</p>
              <button className="btn btn-primary">Create Your First Course</button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default InstructorDashboard;