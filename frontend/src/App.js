import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import Login from './pages/login/login';
import Forms from './pages/consentForm/form';
import Dashboard from './pages/dashboard/dashboard';
import Patients from './pages/patients/patients';
import AddDoctor from './pages/doctor/add';
import Docters from './pages/doctor/doctor';
import Appointments from './pages/appointments';
import ScheduleDetails from './pages/schedule';
import EditPatient from './pages/patients/patientEdit';
import DoctorClients from './pages/doctorClients/doctorClients';

function App() {
  const [mainpage, setMainpage] = useState('');
  const [role, setRole] = useState('');

  const isAuthenticated = () => {
    if (localStorage.getItem('token') && localStorage.getItem('role') && !role) {
      setRole(localStorage.getItem('role'));
    }
    return !!localStorage.getItem('token');
  };
  const getRole = () => {
  return parseInt(localStorage.getItem('role'));
};

  return (
    <div className="App">
    <Router>
      <div className="App">
        {/* <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
          
          
          <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}>
            <Route path="form" element={<Forms />} />
            <Route path="patients" element={<Patients />} />
            <Route path="edit-patient" element={<EditPatient />} />
            <Route path="addDoctor" element={<AddDoctor />} />
            <Route path="doctors" element={<Docters />} />
          </Route>
  
          
          <Route path="/schedule" element={<ScheduleDetails />} /> 
  
         
          <Route path="/calendar" element={<Appointments />} />
        </Routes> */}
     <Routes>
  {/* 🔐 Login Routes */}
  <Route
    path="/"
    element={
      isAuthenticated()
        ? getRole() === 3
          ? <Navigate to="/calendar" />
          : <Navigate to="/dashboard" />
        : <Login />
    }
  />
  <Route
    path="/login"
    element={
      isAuthenticated()
        ? getRole() === 3
          ? <Navigate to="/calendar" />
          : <Navigate to="/dashboard" />
        : <Login />
    }
  />

  {/* 👨‍⚕️ 👩‍💼 👨‍💼 All Authenticated Roles can see Calendar */}
  <Route
    path="/calendar"
    element={
      isAuthenticated()
        ? <Appointments />
        : <Navigate to="/login" />
    }
  />
  <Route
  path="/doctorClients"
  element={
    isAuthenticated()
      ? <DoctorClients />
      : <Navigate to="/login" />
  }
/>

  {/* 🧑‍💼 Admin / Receptionist Dashboard + Routes */}
  {isAuthenticated() && getRole() !== 3 && (
    <>
      <Route path="/dashboard" element={<Dashboard />}>
        <Route path="form" element={<Forms />} />
        <Route path="patients" element={<Patients />} />
        <Route path="edit-patient" element={<EditPatient />} />
        <Route path="addDoctor" element={<AddDoctor />} />
        <Route path="doctors" element={<Docters />} />
        <Route path="doctorClients" element={<DoctorClients />} />
      </Route>

      {/* Optional: Schedule Route */}
      <Route path="/schedule" element={<ScheduleDetails />} />
    </>
  )}

  {/* 🌐 Catch-All Redirect */}
  <Route
    path="*"
    element={
      isAuthenticated()
        ? getRole() === 3
          ? <Navigate to="/calendar" />
          : <Navigate to="/dashboard" />
        : <Navigate to="/login" />
    }
  />
</Routes>


      </div>
    </Router>
  </div>
  
  );
}

export default App;
