import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./components/HomePage";
import ApplyPage from "./components/ApplyPage";
import ArchivePage from "./components/ArchivePage";
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import ClientRegistration from "./components/ClientRegistration";
import ContractorRegistration from "./components/ContractorRegistration";
import VendorRegistration from "./components/VendorRegistration";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        
        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute allowedRoles={['client', 'contractor', 'vendor']}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/apply/:tenderid"
          element={
            <ProtectedRoute allowedRoles={['client', 'contractor', 'vendor']}>
              <ApplyPage />
            </ProtectedRoute>
          }
        />
        
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/ClientRegistration" element={<ClientRegistration />} />
        <Route path="/ContractorRegistration" element={<ContractorRegistration />} />
        <Route path="/VendorRegistration" element={<VendorRegistration />} />

        {/* Catch-all Route to redirect to login page */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;

