// src/Dashboard.js

import React from 'react';
import { useLocation } from 'react-router-dom';

function Dashboard() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const name = params.get('name');
  const email = params.get('email');

  return (
    <div>
      <h1>Welcome, {name}!</h1>
      <p>Your email: {email}</p>
    </div>
  );
}

export default Dashboard;
