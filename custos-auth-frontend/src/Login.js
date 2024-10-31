// src/Login.js

import React, { useState } from 'react';
import './Login.css'; // Import the corresponding CSS file

function Login() {
  const [selectedRole, setSelectedRole] = useState('');

  const handleNormalLogin = () => {
    window.location.href = `http://localhost:8081/login`;
  };

  const handleTestLogin = () => {
    if (!selectedRole) {
      alert('Please select a role for testing.');
      return;
    }
    window.location.href = `http://localhost:8081/login?role=${encodeURIComponent(selectedRole)}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Hospital Portal</h1>
        <p className="login-subtitle">Access your account securely</p>
        <div className="button-group">
          <button className="login-button normal-login" onClick={handleNormalLogin}>
            Login with Custos
          </button>
          <div className="divider">OR</div>
          <div className="test-login-section">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="role-select"
            >
              <option value="">-- Select Role --</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
            <button className="login-button test-login" onClick={handleTestLogin}>
              Login for Testing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
