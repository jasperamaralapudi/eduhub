import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactPlayer from 'react-player';
import api from '../../utils/api';
import LoadingSpinner from '../UI/LoadingSpinner';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const { courseId, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    fetchLessonData();
  }, [lessonId]);

  const fetchLessonData = async () => {
    try {
      const [lessonRes, courseRes] = await Promise.all([
        api.get(`/lessons/${lessonId}`),
        api.get(`/courses/${courseId}`)
      ]);

      setLesson(lessonRes.data.data);
      setCourse(courseRes.data.data);
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProgress = ({ played }) => {
    setProgress(played * 100);
  };

  const markComplete = async () => {
    try {
      await api.post(`/lessons/${lessonId}/complete`);
      // Refresh lesson data or update UI
    } catch (error) {
      console.error('Error marking lesson complete:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex-center" style={{ minHeight: '100vh' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <div className="video-section">
        <div className="video-header">
          <Link to={`/courses/${courseId}`} className="back-link">
            ← Back to Course
          </Link>
          <h1>{lesson?.title}</h1>
        </div>

        <div className="video-wrapper">
          <ReactPlayer
            url={lesson?.videoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'}
            width="100%"
            height="100%"
            controls
            onProgress={handleProgress}
            config={{
              youtube: {
                playerVars: { showinfo: 1 }
              }
            }}
          />
        </div>

        <div className="lesson-progress">
          <div className="progress-bar">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            />
          </div>
          <span>{Math.round(progress)}% complete</span>
        </div>

        <div className="lesson-actions">
          <button 
            className="btn btn-success"
            onClick={markComplete}
          >
            Mark as Complete
          </button>
          <button className="btn btn-outline">
            Add Note
          </button>
        </div>

        <div className="lesson-description">
          <h3>About this lesson</h3>
          <p>{lesson?.description || 'No description available.'}</p>
        </div>
      </div>

      <div className="course-sidebar">
        <div className="course-info">
          <h3>{course?.title}</h3>
          <p>by {course?.instructor?.name}</p>
        </div>

        <div className="lessons-list">
          <h4>Course Content</h4>
          {course?.lessons?.map((courseLesson, index) => (
            <Link
              key={courseLesson._id}
              to={`/learn/${courseId}/${courseLesson._id}`}
              className={`lesson-item ${courseLesson._id === lessonId ? 'active' : ''}`}
            >
              <span className="lesson-number">{index + 1}</span>
              <div className="lesson-info">
                <span className="lesson-title">{courseLesson.title}</span>
                <span className="lesson-duration">{courseLesson.duration}min</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;