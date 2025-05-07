import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/CreateSession.css';

const CreateSession = () => {
  const navigate = useNavigate();

  const [teacherId, setTeacherId] = useState('');
  const [subject, setSubject] = useState('');
  const [department, setDepartment] = useState('');
  const [sessionId, setSessionId] = useState('');
  const [qrUrl, setQrUrl] = useState('');
  const [showQR, setShowQR] = useState(false);
  const [expired, setExpired] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  // Set current date on mount
  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  // Generate session ID
  const generateSessionId = async () => {
    if (!teacherId || !department) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/verify/${teacherId}`);
      if (!response.ok) {
        alert('Error verifying teacher');
        return;
      }

      const data = await response.json();
      if (data.valid) {
        const subjectFromDB = data.subject;
        const rand = Math.floor(10000 + Math.random() * 90000);
        const newSessionId = `${department}-${rand}`;

        setSubject(subjectFromDB);
        setSessionId(newSessionId);

        startQrSession({
          teacherId,
          subject: subjectFromDB,
          sessionId: newSessionId,
          department,
        });
      } else {
        alert('Teacher not found or not valid');
      }
    } catch (error) {
      console.error('Error verifying teacher:', error);
      alert('Error verifying teacher. Please try again.');
    }
  };

  // Start QR session
  const startQrSession = ({ teacherId, subject, sessionId, department }) => {
    clearInterval(intervalRef.current);
    clearTimeout(timeoutRef.current);

    const generateQr = () => {
      const timestamp = Date.now();
      const date = new Date(timestamp).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
      const dynamicData = JSON.stringify({
        teacherId,
        subject,
        sessionId,
        department,
        date,
        timestamp,
      });
      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(dynamicData)}`;
      setQrUrl(qrApiUrl);
    };

    generateQr();
    setShowQR(true);
    setExpired(false);

    intervalRef.current = setInterval(generateQr, 10000);

    timeoutRef.current = setTimeout(() => {
      clearInterval(intervalRef.current);
      setShowQR(false);
      setExpired(true);
      setTimeout(() => {
        setExpired(false);
        resetForm();
      }, 5000);
    }, 120000);
  };

  // Reset the form
  const resetForm = () => {
    setTeacherId('');
    setSubject('');
    setDepartment('');
    setSessionId('');
  };

  return (
    <>
      <div className="create-session-container">
        <h2>Create Session</h2>
        <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>Date: {currentDate}</p>
        <form className="session-form" onSubmit={(e) => e.preventDefault()}>
          <input
            type="text"
            placeholder="Teacher ID"
            value={teacherId}
            onChange={(e) => setTeacherId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Subject"
            value={subject}
            readOnly
          />
          <input type="text" placeholder="Session ID" value={sessionId} readOnly />
          <select value={department} onChange={(e) => setDepartment(e.target.value)}>
            <option value="">Select Department</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
          </select>
          <button type="button" onClick={generateSessionId}>Generate Session</button>
        </form>

        {showQR && (
          <div className="qr-box">
            <img src={qrUrl} alt="QR Code" />
            <p>QR updates every 10s. Session ends in 2 min.</p>
          </div>
        )}

        {expired && <p className="expired-msg">Session expired</p>}
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
            textAlign: 'center'
          }}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default CreateSession;
