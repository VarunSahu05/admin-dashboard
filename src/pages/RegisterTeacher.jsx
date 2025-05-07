import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterTeacher.css';


const RegisterTeacher = () => {
  const navigate = useNavigate();

  return (
    <>
    <div className="teacher-container">
      <h2>Teacher Section</h2>
      <div className="teacher-cards">
        <div style={{color: "black", weight: "bold",  fontFamily: "Roboto"}} className="teacher-card" onClick={() => navigate('/teacher-registration')}>
          Register Teacher
        </div>
        <div style={{color: "black", weight: "bold", fontFamily: "Roboto"}} className="teacher-card" onClick={() => navigate('/create-session')}>
          Create Session
        </div>
      </div>
    </div>
    <div style={{ padding: '2rem', textAlign: 'center' }}>
    <button onClick={() => navigate('/')} style={{ marginTop: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.7rem 1.1rem', borderRadius: '4px', textAlign: 'center' }}>
        Back to Dashboard
      </button>
    </div>
    </>

  );
};

export default RegisterTeacher;
