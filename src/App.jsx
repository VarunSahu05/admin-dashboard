import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import RegisterStudent from './pages/RegisterStudent';
import RegisterTeacher from './pages/RegisterTeacher';
import Home from './pages/Home';
import AttendanceLog from './pages/AttendanceLog';
import StudentsList from './pages/StudentsList';
import TeachersList from './pages/TeachersList';
import TeacherRegistration from './pages/TeacherRegistration';
import CreateSession from './pages/CreateSession';



const Layout = () => {
  const location = useLocation();

  return (
    <>
      {location.pathname === '/' && <Navbar />} {/* ✅ Show only on home */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register-student" element={<RegisterStudent />} />
        <Route path="/register-teacher" element={<RegisterTeacher />} />
        <Route path="/student-list" element={<StudentsList />} />
        <Route path="/teacher-list" element={<TeachersList />} />
        <Route path="/attendance-log" element={<AttendanceLog />} />
        <Route path="/teacher-registration" element={<TeacherRegistration />} />
        <Route path="/create-session" element={<CreateSession />} />
      </Routes>
    </>
  );
};

function App() {
  return (
    <>
      <Layout />
    </>
  );
}

export default App;
