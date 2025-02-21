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

function App() {
  const [mainpage, setMainpage] = useState('');
  const [role, setRole] = useState('');

  const isAuthenticated = () => {
    if (localStorage.getItem('token') && localStorage.getItem('role') && !role) {
      setRole(localStorage.getItem('role'));
    }
    return !!localStorage.getItem('token');
  };

  return (
    <div className="App">
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
          <Route path="/login" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Login />} />
          
          {/* 🟢 Dashboard Routes */}
          <Route path="/dashboard" element={isAuthenticated() ? <Dashboard /> : <Navigate to="/login" />}>
            <Route path="form" element={<Forms />} />
            <Route path="patients" element={<Patients />} />
            <Route path="addDoctor" element={<AddDoctor />} />
            <Route path="doctors" element={<Docters />} />
          </Route>
  
          {/* 🟢 Move Schedule Route OUTSIDE Dashboard */}
          <Route path="/schedule" element={<ScheduleDetails />} /> 
  
          {/* 🟢 Other Routes */}
          <Route path="/calendar" element={<Appointments />} />
        </Routes>
      </div>
    </Router>
  </div>
  
  );
}

export default App;
