import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCourse } from '../context/CourseContext';
import CourseCard from '../components/Course/CourseCard';
import './Home.css';

const Home = () => {
  const { courses, fetchCourses, isLoading } = useCourse();

  useEffect(() => {
    fetchCourses({ limit: 6 });
  }, []);

  const featuredCourses = courses.slice(0, 6);

  return (
    <div className="home">
      {/* Hero Section */}
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <div className="hero-text">
              <h1>Learn Without Limits</h1>
              <p>
                Discover thousands of courses from expert instructors and build the skills 
                you need to advance your career or pursue your passion.
              </p>
              <div className="hero-buttons">
                <Link to="/courses" className="btn btn-primary btn-lg">
                  Start Learning
                </Link>
                <Link to="/register" className="btn btn-outline btn-lg">
                  Join Free
                </Link>
              </div>
            </div>
            <div className="hero-image">
              <img 
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop" 
                alt="Students learning online"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>15,000+</h3>
              <p>Active Students</p>
            </div>
            <div className="stat-item">
              <h3>500+</h3>
              <p>Expert Instructors</p>
            </div>
            <div className="stat-item">
              <h3>1,200+</h3>
              <p>Quality Courses</p>
            </div>
            <div className="stat-item">
              <h3>95%</h3>
              <p>Success Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="featured-courses">
        <div className="container">
          <div className="section-header">
            <h2>Featured Courses</h2>
            <p>Popular courses chosen by our learning community</p>
          </div>

          {isLoading ? (
            <div className="loading-grid">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="course-skeleton" />
              ))}
            </div>
          ) : (
            <div className="courses-grid">
              {featuredCourses.map(course => (
                <CourseCard key={course._id} course={course} />
              ))}
            </div>
          )}

          <div className="section-footer">
            <Link to="/courses" className="btn btn-primary">
              View All Courses
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="categories-section">
        <div className="container">
          <div className="section-header">
            <h2>Popular Categories</h2>
            <p>Find the perfect course in your field of interest</p>
          </div>

          <div className="categories-grid">
            <Link to="/courses?category=Programming" className="category-card">
              <div className="category-icon">💻</div>
              <h3>Programming</h3>
              <p>Learn coding from scratch</p>
            </Link>

            <Link to="/courses?category=Design" className="category-card">
              <div className="category-icon">🎨</div>
              <h3>Design</h3>
              <p>Master visual design</p>
            </Link>

            <Link to="/courses?category=Business" className="category-card">
              <div className="category-icon">📊</div>
              <h3>Business</h3>
              <p>Grow your business skills</p>
            </Link>

            <Link to="/courses?category=Marketing" className="category-card">
              <div className="category-icon">📈</div>
              <h3>Marketing</h3>
              <p>Digital marketing mastery</p>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Start Learning?</h2>
            <p>Join thousands of students already learning on EduHub</p>
            <Link to="/register" className="btn btn-primary btn-lg">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;