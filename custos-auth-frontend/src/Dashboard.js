// src/Dashboard.js

import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import './Dashboard.css'; // Import the corresponding CSS file

function Dashboard() {
  const location = useLocation();
  const [userData, setUserData] = useState({ name: '', email: '', groups: [] });

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const name = params.get('name');
    const email = params.get('email');
    const groupsParam = params.get('groups');
    let groups = [];

    try {
      groups = groupsParam ? JSON.parse(decodeURIComponent(groupsParam)) : [];
    } catch (error) {
      console.error('Error parsing groups:', error);
    }

    setUserData({ name, email, groups });
  }, [location.search]);

  // Authorization logic: Check if the user is in a specific group
  const hasGroup = (groupName) => userData.groups.includes(groupName);

  // Handle logout
  const handleLogout = () => {
    window.location.href = 'http://localhost:8081/logout';
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Hospital Patient/Staff Portal</h1>
        <button className="logout-button" onClick={handleLogout}>
          Log Out
        </button>
      </header>
      <div className="dashboard-content">
        <div className="user-info">
          <h2>Welcome, {userData.name}!</h2>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Your Groups:</strong> {userData.groups.join(', ') || 'None'}</p>
        </div>

        {/* Admin Features */}
        {hasGroup('admin') && (
          <div className="feature-section admin-section">
            <h3>Admin Panel</h3>
            <button className="feature-button">Manage Users</button>
            <button className="feature-button">Manage Groups</button>
          </div>
        )}

        {/* Doctor Features */}
        {hasGroup('doctor') && (
          <div className="feature-section doctor-section">
            <h3>Doctor's Dashboard</h3>
            <button className="feature-button">View Patients</button>
            <button className="feature-button">Schedule Appointments</button>
          </div>
        )}

        {/* Patient Features */}
        {hasGroup('patient') && (
          <div className="feature-section patient-section">
            <h3>Patient Portal</h3>
            <button className="feature-button">View Medical Records</button>
            <button className="feature-button">Book Appointment</button>
          </div>
        )}

        {/* Default Message if No Groups */}
        {!userData.groups.length && (
          <div className="no-access-message">
            <p>You do not have any specific group memberships. Contact your administrator for access.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
