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
  const [totalStudents, setTotalStudents] = useState(0);
  const [scannedCount, setScannedCount] = useState(0);

  const expirationRef = useRef(null);
  const pollRef = useRef(null);

  useEffect(() => {
    const today = new Date();
    const formattedDate = today.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    setCurrentDate(formattedDate);
  }, []);

  const generateSessionId = async () => {
    if (!teacherId || !department) {
      alert('All fields are required');
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/verify/${teacherId}`);
      if (!response.ok) throw new Error('Teacher verification failed');
      const data = await response.json();

      if (data.valid) {
        const rand = Math.floor(10000 + Math.random() * 90000);
        const newSessionId = `${department}-${rand}`;
        const newSubject = data.subject;
        setSessionId(newSessionId);
        setSubject(newSubject);

        // Get total students in department
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/count/${department}`);
        const studentData = await res.json();
        if (!studentData.count) {
          alert('No students registered in this department.');
          return;
        }
        setTotalStudents(studentData.count);

        startQrSession({
          teacherId,
          subject: newSubject,
          sessionId: newSessionId,
          department,
        });
      } else {
        alert('Invalid teacher');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to generate session');
    }
  };

  const generateQrCode = (teacherId, subject, sessionId, department, date, timestamp) => {

    const qrData = {
      teacherId,
      subject,     // ✅ Ensure subject is added
      sessionId,   // ✅ Ensure sessionId is added
      department,
      date,
      timestamp,
    };
    const qrString = JSON.stringify(qrData);
    const qrImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrString)}`;
    setQrUrl(qrImageUrl);
  };

  const startQrSession = ({ teacherId, subject, sessionId, department, date, timestamp}) => {
   generateQrCode( teacherId, subject, sessionId, department, date, timestamp);
    setShowQR(true);
    setExpired(false);

    expirationRef.current = setTimeout(() => {
      stopSession();
    }, 180000); //3 minutes

    pollRef.current = setInterval(async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/count/${sessionId}`);
        if (!res.ok) {
          console.error('Failed to fetch attendance count:', res.status);
          return;
        }
        const data = await res.json();
        console.log('Polling data:', data); // Debugging

        setScannedCount(data.count);


      // Check if all students have been scanned
      if (totalStudents > 0 && data.count >= totalStudents) {
        console.log('All students scanned. Stopping session.'); // Debugging
        stopSession(1000);
        return;
      }

      // Refresh QR code only if a new scan is detected
      if (data.count > scannedCount) {
        setScannedCount(data.count); // Update the scanned count
        const newTimestamp = Date.now();
        generateQrCode(teacherId, subject, sessionId, department, date, newTimestamp);
      }

      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 5000); // check every 5s
  };

  const stopSession = () => {
    clearTimeout(expirationRef.current);
    clearInterval(pollRef.current);
    setShowQR(false);
    setExpired(true);

    setTimeout(() => {
      resetForm();
      setExpired(false);
    }, 5000);
  };

  const resetForm = () => {
    setTeacherId('');
    setSubject('');
    setDepartment('');
    setSessionId('');
    setQrUrl('');
    setScannedCount(0);
    setTotalStudents(0);
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
          <input type="text" placeholder="Subject" value={subject} readOnly />
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
            <p>
              {scannedCount}/{totalStudents} students marked.
              <br />
              QR updates only after each scan.
            </p>
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
            textAlign: 'center',
          }}
        >
          Back
        </button>
      </div>
    </>
  );
};

export default CreateSession;
