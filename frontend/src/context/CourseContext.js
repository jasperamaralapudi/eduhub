import React, { createContext, useContext, useReducer } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

// Initial state
const initialState = {
  courses: [],
  currentCourse: null,
  isLoading: false,
  error: null,
  filters: {
    category: 'all',
    level: 'all',
    search: ''
  }
};

// Action types
const CourseActionTypes = {
  FETCH_START: 'FETCH_START',
  FETCH_COURSES_SUCCESS: 'FETCH_COURSES_SUCCESS',
  FETCH_COURSE_SUCCESS: 'FETCH_COURSE_SUCCESS',
  FETCH_FAIL: 'FETCH_FAIL',
  SET_FILTERS: 'SET_FILTERS',
  CLEAR_ERROR: 'CLEAR_ERROR'
};

// Reducer
const courseReducer = (state, action) => {
  switch (action.type) {
    case CourseActionTypes.FETCH_START:
      return { ...state, isLoading: true, error: null };
    case CourseActionTypes.FETCH_COURSES_SUCCESS:
      return { ...state, courses: action.payload, isLoading: false };
    case CourseActionTypes.FETCH_COURSE_SUCCESS:
      return { ...state, currentCourse: action.payload, isLoading: false };
    case CourseActionTypes.FETCH_FAIL:
      return { ...state, error: action.payload, isLoading: false };
    case CourseActionTypes.SET_FILTERS:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case CourseActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    default:
      return state;
  }
};

// Create context
const CourseContext = createContext();

// Custom hook
export const useCourse = () => {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error('useCourse must be used within a CourseProvider');
  }
  return context;
};

// Course Provider
export const CourseProvider = ({ children }) => {
  const [state, dispatch] = useReducer(courseReducer, initialState);

  // Fetch courses
  const fetchCourses = async (filters = {}) => {
    try {
      dispatch({ type: CourseActionTypes.FETCH_START });

      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, value);
        }
      });

      const response = await api.get(`/courses?${params}`);

      dispatch({
        type: CourseActionTypes.FETCH_COURSES_SUCCESS,
        payload: response.data.data
      });

      return { success: true, data: response.data.data };

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch courses';
      dispatch({ type: CourseActionTypes.FETCH_FAIL, payload: message });
      return { success: false, error: message };
    }
  };

  // Fetch single course
  const fetchCourse = async (courseId) => {
    try {
      dispatch({ type: CourseActionTypes.FETCH_START });

      const response = await api.get(`/courses/${courseId}`);

      dispatch({
        type: CourseActionTypes.FETCH_COURSE_SUCCESS,
        payload: response.data.data
      });

      return { success: true, data: response.data.data };

    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch course';
      dispatch({ type: CourseActionTypes.FETCH_FAIL, payload: message });
      return { success: false, error: message };
    }
  };

  // Enroll in course
  const enrollCourse = async (courseId) => {
    try {
      const response = await api.post(`/courses/${courseId}/enroll`);

      toast.success('Successfully enrolled in course!');
      return { success: true };

    } catch (error) {
      const message = error.response?.data?.message || 'Enrollment failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Set filters
  const setFilters = (filters) => {
    dispatch({ type: CourseActionTypes.SET_FILTERS, payload: filters });
  };

  // Context value
  const value = {
    // State
    courses: state.courses,
    currentCourse: state.currentCourse,
    isLoading: state.isLoading,
    error: state.error,
    filters: state.filters,

    // Actions
    fetchCourses,
    fetchCourse,
    enrollCourse,
    setFilters
  };

  return (
    <CourseContext.Provider value={value}>
      {children}
    </CourseContext.Provider>
  );
};