import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/RegisterStudent.css';

const RegisterStudent = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // Update roll number based on department selection
  useEffect(() => {
    if (department) {
      const randomNum = String(Math.floor(Math.random() * 50) + 1).padStart(2, '0');
      setRollNumber(`${department}-${randomNum}`);
    } else {
      setRollNumber('');
    }
  }, [department]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || name.length < 1 || name.length > 10 || !department) {
      alert('Please fill in all fields correctly.');
      return;
    }

    // Create student data to send to the backend
    const studentData = { name, department, roll: rollNumber };

    try {
      // Make API request to backend to register student
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(studentData),
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage(result.message);
        setTimeout(() => {
          setSuccessMessage('');
          setName('');
          setDepartment('');
          setRollNumber('');
        }, 5000);
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error('Error registering student:', error);
      setErrorMessage('Failed to register student');
    }
  };

  return (
    <>
      <div className="register-student-container">
        <h2 style={{ marginBottom: "0.9rem" }}>Register Student</h2>
        <form className="register-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            maxLength={10}
            onChange={(e) => setName(e.target.value)}
          />
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
          </select>
          <input
            type="text"
            placeholder="Roll Number"
            value={rollNumber}
            readOnly
          />
          <button type="submit">Register</button>
        </form>
        {successMessage && <p className="success-message">{successMessage}</p>}
        {errorMessage && <p className="error-message">{errorMessage}</p>}
      </div>
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <button
          onClick={() => navigate('/')}
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
          Back to Dashboard
        </button>
      </div>
    </>
  );
};

export default RegisterStudent;
