import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true');


  useEffect(() => {
    const handleStorageChange = () => {
      setIsLoggedIn(localStorage.getItem('isLoggedIn') === 'true');
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);


    return (
        <div style={{ padding: '2rem' }}>
          {!isLoggedIn ? (
            <h2 style={{ textAlign: 'center' }}>Please log in as admin to access dashboard features.</h2>
          ) : (
            <div className="home-container">
              <div className="card" onClick={() => navigate('/register-teacher')}>Teacher Portal</div>
              <div className="card" onClick={() => navigate('/register-student')}>Register Student</div>
              <div className="card" onClick={() => navigate('/student-list')}>View Student List</div>
              <div className="card" onClick={() => navigate('/teacher-list')}>View Teacher List</div>
              <div className="card" onClick={() => navigate('/attendance-log')}>Attendance Log</div>
            </div>
          )}
        </div>
    );
};

export default Home;
