import React, { useState } from 'react';
import './styles/LoginForm.css';

const LoginForm = ({ closeForm, onLoginSuccess }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    if (!username || !password) {
      setError('Both fields are required');
      return;
    }
    if (username === 'admin' && password === '123') {
      localStorage.setItem('isLoggedIn', 'true'); // ✅ Set login state here
      onLoginSuccess();
      setError('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="login-backdrop">
      <div className="login-modal">
        <button className="close-btn" onClick={closeForm}>
          ×
        </button>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-msg">{error}</p>}
        <button className="submit-btn" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
