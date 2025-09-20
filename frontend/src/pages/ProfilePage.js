import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useForm } from 'react-hook-form';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      name: user?.name || '',
      bio: user?.bio || '',
      expertise: user?.expertise?.join(', ') || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);

    const profileData = {
      ...data,
      expertise: data.expertise.split(',').map(s => s.trim()).filter(s => s)
    };

    const result = await updateProfile(profileData);

    if (result.success) {
      setIsEditing(false);
    }

    setIsLoading(false);
  };

  const handleCancel = () => {
    reset();
    setIsEditing(false);
  };

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-container">
          <div className="profile-header">
            <div className="profile-avatar">
              <img src={user?.avatar} alt={user?.name} />
            </div>
            <div className="profile-info">
              <h1>{user?.name}</h1>
              <p className="profile-role">{user?.role}</p>
              <p className="profile-email">{user?.email}</p>
            </div>
            <div className="profile-actions">
              {!isEditing && (
                <button 
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>

          <div className="profile-content">
            <div className="profile-stats">
              <div className="stat-card">
                <h3>{user?.enrolledCourses?.length || 0}</h3>
                <p>Enrolled Courses</p>
              </div>

              <div className="stat-card">
                <h3>{user?.completedCourses?.length || 0}</h3>
                <p>Completed Courses</p>
              </div>

              {user?.role === 'instructor' && (
                <>
                  <div className="stat-card">
                    <h3>{user?.createdCourses?.length || 0}</h3>
                    <p>Created Courses</p>
                  </div>

                  <div className="stat-card">
                    <h3>{user?.totalStudents || 0}</h3>
                    <p>Total Students</p>
                  </div>
                </>
              )}
            </div>

            <div className="profile-details">
              {isEditing ? (
                <form onSubmit={handleSubmit(onSubmit)} className="edit-form">
                  <h2>Edit Profile</h2>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      {...register('name')}
                      className="form-control"
                    />
                  </div>

                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      {...register('bio')}
                      className="form-control"
                      rows="4"
                      placeholder="Tell us about yourself..."
                    />
                  </div>

                  {user?.role === 'instructor' && (
                    <div className="form-group">
                      <label>Expertise (comma-separated)</label>
                      <input
                        type="text"
                        {...register('expertise')}
                        className="form-control"
                        placeholder="React, JavaScript, Node.js"
                      />
                    </div>
                  )}

                  <div className="form-actions">
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? <LoadingSpinner size="small" /> : 'Save Changes'}
                    </button>

                    <button 
                      type="button" 
                      className="btn btn-outline"
                      onClick={handleCancel}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className="profile-view">
                  <section>
                    <h2>About</h2>
                    <p>{user?.bio || 'No bio available.'}</p>
                  </section>

                  {user?.role === 'instructor' && user?.expertise?.length > 0 && (
                    <section>
                      <h2>Expertise</h2>
                      <div className="expertise-tags">
                        {user.expertise.map((skill, index) => (
                          <span key={index} className="expertise-tag">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </section>
                  )}

                  <section>
                    <h2>Account Information</h2>
                    <div className="account-info">
                      <div className="info-item">
                        <label>Member Since</label>
                        <span>{new Date(user?.createdAt).toLocaleDateString()}</span>
                      </div>

                      <div className="info-item">
                        <label>Last Login</label>
                        <span>
                          {user?.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString()
                            : 'Never'
                          }
                        </span>
                      </div>
                    </div>
                  </section>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;