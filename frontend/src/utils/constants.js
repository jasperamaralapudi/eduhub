// API endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile'
  },
  COURSES: {
    LIST: '/courses',
    DETAIL: (id) => `/courses/${id}`,
    ENROLL: (id) => `/courses/${id}/enroll`,
    CREATE: '/courses',
    UPDATE: (id) => `/courses/${id}`,
    DELETE: (id) => `/courses/${id}`
  },
  LESSONS: {
    LIST: (courseId) => `/lessons/course/${courseId}`,
    DETAIL: (id) => `/lessons/${id}`,
    COMPLETE: (id) => `/lessons/${id}/complete`
  },
  USERS: {
    LIST: '/users',
    DETAIL: (id) => `/users/${id}`,
    UPDATE: (id) => `/users/${id}`,
    DELETE: (id) => `/users/${id}`
  }
};

// Course categories
export const COURSE_CATEGORIES = [
  'Programming',
  'Design',
  'Business',
  'Marketing',
  'Data Science',
  'Mobile Development',
  'Web Development',
  'DevOps',
  'Cybersecurity',
  'AI/ML',
  'Other'
];

// Course levels
export const COURSE_LEVELS = [
  'Beginner',
  'Intermediate',
  'Advanced'
];

// User roles
export const USER_ROLES = {
  STUDENT: 'student',
  INSTRUCTOR: 'instructor',
  ADMIN: 'admin'
};

// File upload limits
export const UPLOAD_LIMITS = {
  MAX_FILE_SIZE: 100 * 1024 * 1024, // 100MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/gif'],
  ALLOWED_VIDEO_TYPES: ['video/mp4', 'video/mpeg'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'text/plain']
};

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50
};

// Toast notification settings
export const TOAST_CONFIG = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true
};