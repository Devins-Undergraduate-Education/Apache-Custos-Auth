// src/Login.js

import React from 'react';

function Login() {
  const handleLogin = () => {
    window.location.href = 'http://localhost:8081/login';
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to the Custos Auth Application</h1>
      <button onClick={handleLogin}>Login with Custos</button>
    </div>
  );
}

export default Login;
