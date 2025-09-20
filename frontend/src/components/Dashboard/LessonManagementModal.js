import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../utils/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import './LessonManagementModal.css';

const LessonManagementModal = ({ course, onClose, onLessonUpdate }) => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    duration: 0,
    order: 1
  });

  useEffect(() => {
    fetchLessons();
  }, [course._id]);

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/lessons/course/${course._id}`);
      setLessons(response.data.data || []);
    } catch (error) {
      console.error('Fetch lessons error:', error);
      toast.error('Failed to load lessons');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'duration' || name === 'order' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const lessonData = {
        ...formData,
        courseId: course._id
      };

      let response;
      if (editingLesson) {
        response = await api.put(`/lessons/${editingLesson._id}`, lessonData);
        toast.success('Lesson updated successfully!');
      } else {
        response = await api.post('/lessons', lessonData);
        toast.success('Lesson created successfully!');
      }

      if (response.data.success) {
        resetForm();
        fetchLessons();
        onLessonUpdate();
      }
    } catch (error) {
      console.error('Submit lesson error:', error);
      toast.error(error.response?.data?.message || 'Failed to save lesson');
    }
  };

  const handleEdit = (lesson) => {
    setFormData({
      title: lesson.title,
      description: lesson.description,
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || 0,
      order: lesson.order || 1
    });
    setEditingLesson(lesson);
    setShowCreateForm(true);
  };

  const handleDelete = async (lessonId) => {
    if (!window.confirm('Are you sure you want to delete this lesson? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await api.delete(`/lessons/${lessonId}`);
      
      if (response.data.success) {
        toast.success('Lesson deleted successfully!');
        fetchLessons();
        onLessonUpdate();
      }
    } catch (error) {
      console.error('Delete lesson error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete lesson');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      videoUrl: '',
      duration: 0,
      order: lessons.length + 1
    });
    setEditingLesson(null);
    setShowCreateForm(false);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content lesson-management-modal">
        <div className="modal-header">
          <h2>Manage Lessons - {course.title}</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {!showCreateForm ? (
            <div className="lessons-overview">
              <div className="lessons-header">
                <h3>Course Lessons ({lessons.length})</h3>
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowCreateForm(true)}
                >
                  ➕ Add New Lesson
                </button>
              </div>

              {loading ? (
                <div className="loading-container">
                  <LoadingSpinner size="medium" />
                </div>
              ) : lessons.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📖</div>
                  <h4>No lessons yet</h4>
                  <p>Add your first lesson to get started.</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowCreateForm(true)}
                  >
                    Create First Lesson
                  </button>
                </div>
              ) : (
                <div className="lessons-list">
                  {lessons.map((lesson, index) => (
                    <div key={lesson._id} className="lesson-item">
                      <div className="lesson-number">
                        {lesson.order || index + 1}
                      </div>
                      
                      <div className="lesson-content">
                        <h4 className="lesson-title">{lesson.title}</h4>
                        <p className="lesson-description">{lesson.description}</p>
                        
                        <div className="lesson-meta">
                          {lesson.duration > 0 && (
                            <span className="duration">
                              🕐 {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')} min
                            </span>
                          )}
                          {lesson.videoUrl && (
                            <span className="has-video">🎥 Has Video</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="lesson-actions">
                        <button 
                          className="btn btn-sm btn-outline"
                          onClick={() => handleEdit(lesson)}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(lesson._id)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="lesson-form-container">
              <div className="form-header">
                <h3>{editingLesson ? 'Edit Lesson' : 'Create New Lesson'}</h3>
                <button 
                  className="btn btn-outline btn-sm"
                  onClick={resetForm}
                >
                  ← Back to Lessons
                </button>
              </div>

              <form onSubmit={handleSubmit} className="lesson-form">
                <div className="form-group">
                  <label htmlFor="title">Lesson Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="Enter lesson title"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="description">Lesson Description *</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Describe what students will learn in this lesson"
                    rows="4"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="videoUrl">Video URL (Optional)</label>
                  <input
                    type="url"
                    id="videoUrl"
                    name="videoUrl"
                    value={formData.videoUrl}
                    onChange={handleInputChange}
                    placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="duration">Duration (minutes)</label>
                    <input
                      type="number"
                      id="duration"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="order">Lesson Order</label>
                    <input
                      type="number"
                      id="order"
                      name="order"
                      value={formData.order}
                      onChange={handleInputChange}
                      placeholder="1"
                      min="1"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button 
                    type="button" 
                    className="btn btn-outline"
                    onClick={resetForm}
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                  >
                    {editingLesson ? 'Update Lesson' : 'Create Lesson'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LessonManagementModal;