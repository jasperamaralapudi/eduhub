import React from 'react';
import './About.css';

const About = () => {
  return (
    <div className="about-page">
      <div className="container">
        <div className="about-hero">
          <h1>About EduHub</h1>
          <p>Empowering learners worldwide with quality education</p>
        </div>

        <div className="about-content">
          <section className="about-section">
            <h2>Our Mission</h2>
            <p>
              EduHub is dedicated to making quality education accessible to everyone, everywhere. 
              We believe that learning should be engaging, practical, and tailored to individual needs.
            </p>
          </section>

          <section className="about-section">
            <h2>What We Offer</h2>
            <div className="features-grid">
              <div className="feature-card">
                <h3>🎓 Expert Instructors</h3>
                <p>Learn from industry professionals with real-world experience</p>
              </div>
              <div className="feature-card">
                <h3>📱 Mobile Learning</h3>
                <p>Access courses anywhere, anytime on any device</p>
              </div>
              <div className="feature-card">
                <h3>🏆 Certificates</h3>
                <p>Earn certificates to showcase your new skills</p>
              </div>
              <div className="feature-card">
                <h3>💬 Community</h3>
                <p>Connect with fellow learners and build your network</p>
              </div>
            </div>
          </section>

          <section className="about-section">
            <h2>Our Stats</h2>
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
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;