import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import './Dashboard.css';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCourses: 0,
    totalRevenue: 0,
    activeUsers: 0
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mock data for demo
      setStats({
        totalUsers: 15420,
        totalCourses: 342,
        totalRevenue: 245680,
        activeUsers: 3250
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="container">
        <div className="dashboard-header">
          <h1>Admin Dashboard</h1>
          <p>Platform overview and management</p>
        </div>

        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>{stats.totalUsers.toLocaleString()}</h3>
            <p>Total Users</p>
          </div>

          <div className="stat-card">
            <h3>{stats.totalCourses}</h3>
            <p>Total Courses</p>
          </div>

          <div className="stat-card">
            <h3>${stats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>

          <div className="stat-card">
            <h3>{stats.activeUsers.toLocaleString()}</h3>
            <p>Active Users</p>
          </div>
        </div>

        <div className="dashboard-actions">
          <button className="btn btn-primary">Manage Users</button>
          <button className="btn btn-primary">Manage Courses</button>
          <button className="btn btn-outline">View Reports</button>
          <button className="btn btn-outline">System Settings</button>
        </div>

        <section className="dashboard-section">
          <h2>Recent Activity</h2>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-info">
                <p><strong>New user registered:</strong> John Doe</p>
                <small>2 minutes ago</small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-info">
                <p><strong>Course published:</strong> Advanced React Patterns</p>
                <small>15 minutes ago</small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-info">
                <p><strong>Payment received:</strong> $89.99 from student enrollment</p>
                <small>1 hour ago</small>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;