import React, { useState } from 'react';
import './styles/Navbar.css';
import LoginForm from './LoginForm';

const Navbar = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');


  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    window.dispatchEvent(new Event('storage')); // ✅ Notify Home.jsx
    setIsLoggedIn(false);
  };


  return (
    <div>
      <nav className="navbar">
        <div className="navbar-title">Admin Dashboard</div>
        {!isLoggedIn ? (
          <button className="login-btn" onClick={() => setShowLogin(true)}>
            Login
          </button>
        ) : (
          <div className="status">
            <span className="logged-in-text">Logged in</span>
            <button className="logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </nav>
      {showLogin && (
        <LoginForm
          closeForm={() => setShowLogin(false)}
          onLoginSuccess={() => {
            localStorage.setItem('isLoggedIn', 'true');
            window.dispatchEvent(new Event('storage'));
            setIsLoggedIn(true);
            setShowLogin(false);
          }}
        />
      )}
    </div>
  );
};

export default Navbar;
