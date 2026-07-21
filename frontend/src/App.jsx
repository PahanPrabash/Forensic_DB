import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './layouts/AppLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Cases from './pages/Cases';
import PatientRegistration from './pages/PatientRegistration';
import MlefForm from './pages/MlefForm';
import MlReport from './pages/MlReport';
import ReferralsAndReviews from './pages/ReferralsAndReviews';
import AutopsyForm from './pages/AutopsyForm';
import CauseOfDeathForm from './pages/CauseOfDeathForm';
import CourtSummons from './pages/CourtSummons';
import AuditAndNotifications from './pages/AuditAndNotifications';
import Evidence from './pages/Evidence';
import Reports from './pages/Reports';
import Signup from './pages/Signup';

function App() {
  return (
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
          <Route path="/mlr-report" element={<MlReport />} />
          <Route path="/referrals" element={<ReferralsAndReviews />} />
          <Route path="/autopsy-pmr" element={<AutopsyForm />} />
          <Route path="/cause-of-death" element={<CauseOfDeathForm />} />
          <Route path="/court-summons" element={<CourtSummons />} />
          <Route path="/audit-notifications" element={<AuditAndNotifications />} />
          <Route path="/evidence" element={<Evidence />} />
          <Route path="/reports" element={<Reports />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
