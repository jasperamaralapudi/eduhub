import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../UI/LoadingSpinner';
import './Auth.css';

const schema = yup.object().shape({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
  confirmPassword: yup.string()
    .oneOf([yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required'),
  role: yup.string().oneOf(['student', 'instructor'], 'Please select a valid role').required('Role is required')
});

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(schema)
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    const { confirmPassword, ...registrationData } = data;
    const result = await registerUser(registrationData);

    if (result.success) {
      navigate('/dashboard', { replace: true });
    }
    setIsLoading(false);
  };

  return (
    <div className="auth-container">
      <div className="auth-form">
        <div className="auth-header">
          <h2>Join EduHub</h2>
          <p>Create your account to start learning</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="form">
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              {...register('name')}
              className={`form-control ${errors.name ? 'error' : ''}`}
              placeholder="Enter your full name"
            />
            {errors.name && <span className="error-text">{errors.name.message}</span>}
          </div>

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              {...register('email')}
              className={`form-control ${errors.email ? 'error' : ''}`}
              placeholder="Enter your email"
            />
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="form-group">
            <label>I want to</label>
            <select
              {...register('role')}
              className={`form-control ${errors.role ? 'error' : ''}`}
            >
              <option value="">Select your role</option>
              <option value="student">Learn as a Student</option>
              <option value="instructor">Teach as an Instructor</option>
            </select>
            {errors.role && <span className="error-text">{errors.role.message}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              {...register('password')}
              className={`form-control ${errors.password ? 'error' : ''}`}
              placeholder="Create a password"
            />
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              {...register('confirmPassword')}
              className={`form-control ${errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isLoading}
          >
            {isLoading ? <LoadingSpinner size="small" /> : 'Create Account'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Already have an account? 
            <Link to="/login"> Sign in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;