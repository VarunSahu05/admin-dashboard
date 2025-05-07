// pages/AttendanceLog.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/attendance-log.css';

const AttendanceLog = () => {
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [filteredLogs, setFilteredLogs] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const navigate = useNavigate();

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/attendance/logs`);
      const data = await res.json();
      setAttendanceLogs(data);

      // Extract unique departments
      const uniqueDepartments = [...new Set(data.map(log => log.department))];
      setDepartments(uniqueDepartments);
    } catch (error) {
      console.error('Error fetching attendance logs:', error);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  useEffect(() => {
    filterLogs();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDepartment, selectedDate, attendanceLogs]);

  const filterLogs = () => {
    let filtered = attendanceLogs;

    if (selectedDepartment) {
      filtered = filtered.filter(log => log.department === selectedDepartment);
    }

    if (selectedDate) {
      filtered = filtered.filter(log =>
        new Date(log.timestamp).toISOString().slice(0, 10) === selectedDate
      );
    }

    setFilteredLogs(filtered);
  };

  return (
    <>
      <div className="log-container">
        <h2>📋 Attendance Log</h2>

        {/* Filter Controls */}
        <div className="filter-bar">
          <select value={selectedDepartment} onChange={e => setSelectedDepartment(e.target.value)}>
            <option value="">All Departments</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
            {departments.map((dept, idx) => (
              <option key={idx} value={dept}>{dept}</option>
            ))}
          </select>

          <input
            type="date"
            value={selectedDate}
            onChange={e => setSelectedDate(e.target.value)}
          />

          <button onClick={() => { setSelectedDepartment(''); setSelectedDate(''); }}>
            Clear Filters
          </button>
        </div>

        <table className="log-table">
          <thead>
            <tr>
              <th>Student Name</th>
              <th>Roll</th>
              <th>Department</th>
              <th>Teacher Name</th>
              <th>Teacher ID</th>
              <th>Subject</th>
              <th>Session ID</th>
              <th>Timestamp</th>
            </tr>
          </thead>
          <tbody>
            {filteredLogs.length > 0 ? (
              filteredLogs.map((log, index) => (
                <tr key={index}>
                  <td>{log.studentName}</td>
                  <td>{log.studentRoll}</td>
                  <td>{log.department}</td>
                  <td>{log.teacherName}</td>
                  <td>{log.teacherId}</td>
                  <td>{log.subject}</td>
                  <td>{log.sessionId}</td>
                  <td>{new Date(log.timestamp).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" style={{ textAlign: 'center', padding: '1rem' }}>
                  No attendance logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div style={{ padding: '2rem', textAlign: 'center' }}>
    <button onClick={() => navigate('/')} style={{ marginTop: '1rem', backgroundColor: '#007bff', color: 'white', border: 'none', padding: '0.7rem 1.1rem', borderRadius: '4px', textAlign: 'center' }}>
        Back to Dashboard
      </button>
    </div>
    </>
  );
};

export default AttendanceLog;
