import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import PatientRegistration from './pages/PatientRegistration';
import MlefForm from './pages/MlefForm';
import AutopsyForm from './pages/AutopsyForm';
import Evidence from './pages/Evidence';
import Reports from './pages/Reports';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import StaffManagement from './pages/StaffManagement';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes inside AppLayout */}
          <Route element={<AppLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/cases" element={<Cases />} />
            <Route path="/register-patient" element={<PatientRegistration />} />
            <Route path="/clinical-mlef" element={<MlefForm />} />
            <Route path="/autopsy-pmr" element={<AutopsyForm />} />
            <Route path="/evidence" element={<Evidence />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/staff" element={<StaffManagement />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
