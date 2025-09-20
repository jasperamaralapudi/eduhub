import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ size = 'medium', color = '#007bff' }) => {
  return (
    <div 
      className={`loading-spinner loading-spinner--${size}`}
      style={{ borderTopColor: color }}
    />
  );
};

export default LoadingSpinner;