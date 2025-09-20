import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import './Contact.css';

const Contact = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    // Simulate sending message
    setTimeout(() => {
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      reset();
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="contact-page">
      <div className="container">
        <div className="contact-hero">
          <h1>Contact Us</h1>
          <p>We'd love to hear from you. Send us a message!</p>
        </div>

        <div className="contact-content">
          <div className="contact-info">
            <div className="info-card">
              <h3>📧 Email</h3>
              <p>support@eduhub.com</p>
            </div>
            
            <div className="info-card">
              <h3>📞 Phone</h3>
              <p>+1 (555) 123-4567</p>
            </div>
            
            <div className="info-card">
              <h3>🏢 Office</h3>
              <p>123 Learning Street<br />Education City, EC 12345</p>
            </div>
            
            <div className="info-card">
              <h3>🕒 Hours</h3>
              <p>Mon - Fri: 9AM - 6PM<br />Sat - Sun: 10AM - 4PM</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="contact-form">
            <h2>Send us a Message</h2>
            
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                {...register('name', { required: 'Name is required' })}
                className={`form-control ${errors.name ? 'error' : ''}`}
                placeholder="Your full name"
              />
              {errors.name && <span className="error-text">{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\S+@\S+$/i,
                    message: 'Invalid email address'
                  }
                })}
                className={`form-control ${errors.email ? 'error' : ''}`}
                placeholder="your.email@example.com"
              />
              {errors.email && <span className="error-text">{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Subject</label>
              <input
                type="text"
                {...register('subject', { required: 'Subject is required' })}
                className={`form-control ${errors.subject ? 'error' : ''}`}
                placeholder="What's this about?"
              />
              {errors.subject && <span className="error-text">{errors.subject.message}</span>}
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                className={`form-control ${errors.message ? 'error' : ''}`}
                rows="5"
                placeholder="Tell us how we can help you..."
              />
              {errors.message && <span className="error-text">{errors.message.message}</span>}
            </div>

            <button 
              type="submit" 
              className="btn btn-primary btn-full"
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;