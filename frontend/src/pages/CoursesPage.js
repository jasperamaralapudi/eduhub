import React, { useEffect, useState } from 'react';
import { useCourse } from '../context/CourseContext';
import CourseCard from '../components/Course/CourseCard';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import { COURSE_CATEGORIES, COURSE_LEVELS } from '../utils/constants';
import './CoursesPage.css';

const CoursesPage = () => {
  const { courses, isLoading, fetchCourses, filters, setFilters } = useCourse();
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCourses(filters);
  }, [filters]);

  const handleFilterChange = (filterType, value) => {
    setFilters({ [filterType]: value });
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setFilters({ search: searchTerm });
  };

  return (
    <div className="courses-page">
      <div className="container">
        {/* Page Header */}
        <div className="page-header">
          <h1>All Courses</h1>
          <p>Discover your next learning adventure</p>
        </div>

        {/* Filters */}
        <div className="filters-section">
          <form onSubmit={handleSearch} className="search-form">
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div className="filters">
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Categories</option>
              {COURSE_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filters.level}
              onChange={(e) => handleFilterChange('level', e.target.value)}
              className="filter-select"
            >
              <option value="all">All Levels</option>
              {COURSE_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Course Results */}
        <div className="courses-section">
          {isLoading ? (
            <div className="loading-container">
              <LoadingSpinner size="large" />
              <p>Loading courses...</p>
            </div>
          ) : courses.length === 0 ? (
            <div className="no-results">
              <h3>No courses found</h3>
              <p>Try adjusting your filters or search terms</p>
            </div>
          ) : (
            <>
              <div className="results-header">
                <h2>{courses.length} courses found</h2>
              </div>
              <div className="courses-grid">
                {courses.map(course => (
                  <CourseCard key={course._id} course={course} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;