import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './styles/ViewTable.css';

const TeachersList = () => {
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);

  const fetchTeachers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers`);
      const data = await res.json();
      data.sort((a, b) => a.teacherId.localeCompare(b.teacherId, undefined, { numeric: true }));
      setTeachers(data);
    } catch (error) {
      console.error('Error fetching teachers:', error);
    }
  };

  const deleteTeacher = async (id) => {
    try {
      await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/teachers/${id}`, {
        method: 'DELETE',
      });
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (error) {
      console.error('Error deleting teacher:', error);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);


  return (
    <>
    <div className="table-container">
      <h2>View Teachers</h2>
      <table className="custom-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Teacher ID</th>
            <th>Subject</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {teachers.map((teacher) => (
            <tr key={teacher._id}>
              <td>{teacher.name}</td>
              <td>{teacher.teacherId}</td>
              <td>{teacher.subject}</td>
              <td>
                <button className="delete-btn" onClick={() => deleteTeacher(teacher._id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
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

export default TeachersList;



