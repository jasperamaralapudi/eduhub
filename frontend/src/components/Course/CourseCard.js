import React from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/helpers';
import './CourseCard.css';

const CourseCard = ({ course }) => {
  return (
    <div className="course-card">
      <div className="course-thumbnail">
        <img src={course.thumbnail} alt={course.title} />
        <div className="course-level">{course.level}</div>
      </div>

      <div className="course-content">
        <h3 className="course-title">
          <Link to={`/courses/${course._id}`}>{course.title}</Link>
        </h3>

        <p className="course-instructor">
          by {course.instructor?.name || 'Unknown'}
        </p>

        <p className="course-description">
          {course.shortDescription || course.description?.substring(0, 100)}...
        </p>

        <div className="course-meta">
          <div className="rating">
            <span className="stars">
              {'★'.repeat(Math.floor(course.rating?.average || 0))}
              {'☆'.repeat(5 - Math.floor(course.rating?.average || 0))}
            </span>
            <span>{course.rating?.average?.toFixed(1) || '0.0'} ({course.rating?.count || 0})</span>
          </div>

          <div className="students">
            👥 {course.studentsEnrolled || 0} students
          </div>

          <div className="duration">
            🕐 {course.formattedDuration || course.duration?.hours + 'h ' + course.duration?.minutes + 'm'}
          </div>
        </div>

        <div className="course-footer">
          <div className="price">
            {course.discountPrice ? (
              <>
                <span className="original-price">{formatCurrency(course.price)}</span>
                <span className="discount-price">{formatCurrency(course.discountPrice)}</span>
              </>
            ) : (
              <span className="price-current">{formatCurrency(course.price)}</span>
            )}
          </div>

          <Link 
            to={`/courses/${course._id}`} 
            className="btn btn-primary btn-sm"
          >
            View Course
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;