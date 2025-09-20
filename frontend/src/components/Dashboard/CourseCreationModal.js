import React, { useState } from 'react';
import { toast } from 'react-toastify';
import './CourseCreationModal.css';

const CourseCreationModal = ({ onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    shortDescription: '',
    category: '',
    level: 'Beginner',
    price: '',
    discountPrice: '',
    thumbnail: '',
    duration: { hours: 0, minutes: 0 },
    requirements: [''],
    learningOutcomes: [''],
    tags: ''
  });

  const [loading, setLoading] = useState(false);

  const categories = [
    'Programming', 'Design', 'Business', 'Marketing', 
    'Data Science', 'Mobile Development', 'Web Development', 
    'DevOps', 'Cybersecurity', 'AI/ML', 'Other'
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleArrayChange = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field, index) => {
    if (formData[field].length > 1) {
      setFormData(prev => ({
        ...prev,
        [field]: prev[field].filter((_, i) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    
    try {
      const processedData = {
        ...formData,
        price: parseFloat(formData.price) || 0,
        discountPrice: formData.discountPrice ? parseFloat(formData.discountPrice) : null,
        requirements: formData.requirements.filter(req => req.trim()),
        learningOutcomes: formData.learningOutcomes.filter(outcome => outcome.trim()),
        tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      };

      await onSubmit(processedData);
    } catch (error) {
      console.error('Submit error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content course-creation-modal">
        <div className="modal-header">
          <h2>Create New Course</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleSubmit} className="course-form">
          <div className="form-section">
            <h3>Basic Information</h3>
            
            <div className="form-group">
              <label htmlFor="title">Course Title *</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Enter course title"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="shortDescription">Short Description *</label>
              <input
                type="text"
                id="shortDescription"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleInputChange}
                placeholder="Brief description for course cards"
                maxLength="150"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">Detailed Description *</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Detailed course description"
                rows="4"
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="level">Level *</label>
                <select
                  id="level"
                  name="level"
                  value={formData.level}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Pricing & Media</h3>
            
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="price">Price ($) *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="discountPrice">Discount Price ($)</label>
                <input
                  type="number"
                  id="discountPrice"
                  name="discountPrice"
                  value={formData.discountPrice}
                  onChange={handleInputChange}
                  placeholder="Optional discount price"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="thumbnail">Thumbnail URL</label>
              <input
                type="url"
                id="thumbnail"
                name="thumbnail"
                value={formData.thumbnail}
                onChange={handleInputChange}
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="duration.hours">Duration (Hours)</label>
                <input
                  type="number"
                  id="duration.hours"
                  name="duration.hours"
                  value={formData.duration.hours}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration.minutes">Duration (Minutes)</label>
                <input
                  type="number"
                  id="duration.minutes"
                  name="duration.minutes"
                  value={formData.duration.minutes}
                  onChange={handleInputChange}
                  placeholder="0"
                  min="0"
                  max="59"
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h3>Course Requirements</h3>
            {formData.requirements.map((req, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={req}
                  onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                  placeholder="Enter requirement"
                />
                <button 
                  type="button" 
                  onClick={() => removeArrayItem('requirements', index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => addArrayItem('requirements')}
              className="add-btn"
            >
              + Add Requirement
            </button>
          </div>

          <div className="form-section">
            <h3>Learning Outcomes</h3>
            {formData.learningOutcomes.map((outcome, index) => (
              <div key={index} className="array-item">
                <input
                  type="text"
                  value={outcome}
                  onChange={(e) => handleArrayChange('learningOutcomes', index, e.target.value)}
                  placeholder="What will students learn?"
                />
                <button 
                  type="button" 
                  onClick={() => removeArrayItem('learningOutcomes', index)}
                  className="remove-btn"
                >
                  ✕
                </button>
              </div>
            ))}
            <button 
              type="button" 
              onClick={() => addArrayItem('learningOutcomes')}
              className="add-btn"
            >
              + Add Learning Outcome
            </button>
          </div>

          <div className="form-section">
            <h3>Tags</h3>
            <div className="form-group">
              <label htmlFor="tags">Tags (comma-separated)</label>
              <input
                type="text"
                id="tags"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="javascript, react, frontend, beginner"
              />
            </div>
          </div>

          <div className="modal-footer">
            <button 
              type="button" 
              className="btn btn-outline"
              onClick={onClose}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Course'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CourseCreationModal;