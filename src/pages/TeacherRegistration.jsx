import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/TeacherRegistration.css';

const TeacherRegistration = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate inputs
    if (
      !name || name.length < 1 || name.length > 16 ||
      !teacherId || isNaN(teacherId) || teacherId < 1 || teacherId > 50 ||
      !subject || subject.length < 1 || subject.length > 30
    ) {
      alert('Please fill in all fields correctly.');
      return;
    }

    // Build request data
    const teacherData = {
      name,
      teacherId: `T-${teacherId.padStart(2, '0')}`,
      subject
    };

    try {
      const res = await fetch('http://localhost:5000/api/teachers/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(teacherData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          setSuccessMessage('');
          setName('');
          setTeacherId('');
          setSubject('');
        }, 5000);
      } else {
        setErrorMessage(result.message || 'Failed to register');
      }
    } catch (err) {
      console.error('Registration error:', err);
      setErrorMessage('Server error. Please try again.');
    }
  };

  return (
    <>
      <div className="teacher-reg-container">
        <h2 style={{ marginBottom: "0.9rem" }}>Register Teacher</h2>
        <form className="teacher-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Teacher Name"
            value={name}
            maxLength={16}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="number"
            placeholder="Teacher ID (1-50)"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            maxLength={30}
            onChange={(e) => setSubject(e.target.value)}
          />
          <button type="submit">Register</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/register-teacher')}
          style={{
            marginTop: '1rem',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            padding: '0.7rem 1.1rem',
            borderRadius: '4px',
            textAlign: 'center',
          }}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default TeacherRegistration;
