import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../utils/api';

// Initial state
const initialState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null
};

// Action types
const AuthActionTypes = {
  AUTH_START: 'AUTH_START',
  AUTH_SUCCESS: 'AUTH_SUCCESS',
  AUTH_FAIL: 'AUTH_FAIL',
  LOGOUT: 'LOGOUT',
  CLEAR_ERROR: 'CLEAR_ERROR',
  UPDATE_USER: 'UPDATE_USER'
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AuthActionTypes.AUTH_START:
      return { ...state, isLoading: true, error: null };
    case AuthActionTypes.AUTH_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      };
    case AuthActionTypes.AUTH_FAIL:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload
      };
    case AuthActionTypes.LOGOUT:
      return { ...initialState, isLoading: false, token: null };
    case AuthActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    case AuthActionTypes.UPDATE_USER:
      return { ...state, user: { ...state.user, ...action.payload } };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load user on app start
  useEffect(() => {
    loadUser();
  }, []);

  // Set token in axios defaults when token changes
  useEffect(() => {
    if (state.token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${state.token}`;
      localStorage.setItem('token', state.token);
    } else {
      delete api.defaults.headers.common['Authorization'];
      localStorage.removeItem('token');
    }
  }, [state.token]);

  // Load user from token
  const loadUser = async () => {
    const token = localStorage.getItem('token');

    if (!token) {
      dispatch({ type: AuthActionTypes.AUTH_FAIL, payload: 'No token found' });
      return;
    }

    try {
      dispatch({ type: AuthActionTypes.AUTH_START });

      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await api.get('/auth/me');

      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: { user: response.data.user, token }
      });

    } catch (error) {
      console.error('Load user error:', error);
      dispatch({ type: AuthActionTypes.AUTH_FAIL, payload: 'Invalid token' });
    }
  };

  // Register user
  const register = async (userData) => {
    try {
      dispatch({ type: AuthActionTypes.AUTH_START });

      const response = await api.post('/auth/register', userData);

      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: { user: response.data.user, token: response.data.token }
      });

      toast.success('Registration successful! Welcome to EduHub!');
      return { success: true, data: response.data };

    } catch (error) {
      const message = error.response?.data?.message || 'Registration failed';
      dispatch({ type: AuthActionTypes.AUTH_FAIL, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Login user
  const login = async (credentials) => {
    try {
      dispatch({ type: AuthActionTypes.AUTH_START });

      const response = await api.post('/auth/login', credentials);

      dispatch({
        type: AuthActionTypes.AUTH_SUCCESS,
        payload: { user: response.data.user, token: response.data.token }
      });

      toast.success(`Welcome back, ${response.data.user.name}!`);
      return { success: true, data: response.data };

    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      dispatch({ type: AuthActionTypes.AUTH_FAIL, payload: message });
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Logout user
  const logout = async () => {
    try {
      if (state.token) {
        await api.post('/auth/logout');
      }
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      dispatch({ type: AuthActionTypes.LOGOUT });
      toast.info('You have been logged out');
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      const response = await api.put('/auth/profile', profileData);

      dispatch({
        type: AuthActionTypes.UPDATE_USER,
        payload: response.data.user
      });

      toast.success('Profile updated successfully!');
      return { success: true, data: response.data.user };

    } catch (error) {
      const message = error.response?.data?.message || 'Profile update failed';
      toast.error(message);
      return { success: false, error: message };
    }
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Context value
  const value = {
    // State
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    register,
    login,
    logout,
    updateProfile,
    loadUser,

    // Utilities
    hasRole
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;