import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ViewTable.css';
import './styles/StudentList.css';

const StudentList = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState('');

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students`);
      const data = await res.json();
      data.sort((a, b) => a.roll.localeCompare(b.roll, undefined, { numeric: true }));

      setStudents(data);
      setFilteredStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const deleteStudent = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/students/${id}`, {
        method: 'DELETE',
      });
      setStudents((prev) => prev.filter((s) => s._id !== id));
      setFilteredStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (error) {
      console.error('Error deleting student:', error);
    }
  };

  const handleDepartmentChange = (e) => {
    const dept = e.target.value;
    setSelectedDepartment(dept);
    if (dept === '') {
      setFilteredStudents(students);
    } else {
      setFilteredStudents(students.filter(s => s.department === dept));
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return (
    <>
      <div className="table-container">
        <h2>View Students</h2>

        <div className="filter-dropdown">
          <label htmlFor="department-select">Filter by Department:</label>
          <select
            id="department-select"
            value={selectedDepartment}
            onChange={handleDepartmentChange}
          >
            <option value="">All</option>
            <option value="CSE">CSE</option>
            <option value="ECE">ECE</option>
            <option value="IT">IT</option>
          </select>
        </div>

        <table className="custom-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Roll</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.map((student) => (
              <tr key={student._id}>
                <td>{student.name}</td>
                <td>{student.department}</td>
                <td>{student.roll}</td>
                <td>
                  <button className="delete-btn" onClick={() => deleteStudent(student._id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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

export default StudentList;
