import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { useAuth } from './context/AuthContext';

// Layout Components
import DashboardLayout from './components/layout/DashboardLayout';

// Auth Components
import Login from './components/auth/Login';

// Main Components
import Dashboard from './components/dashboard/Dashboard';
import BabysitterManagement from './components/babysitters/BabysitterManagement';
import ChildManagement from './components/children/ChildManagement';
import AttendanceTracking from './components/attendance/AttendanceTracking';
import IncidentReporting from './components/incidents/IncidentReporting';
import FinancialManagement from './components/finances/FinancialManagement';

function App() {
  const { isAuthenticated, user, logout, loading } = useAuth();
  
  // Show loading indicator if auth state is still loading
  if (loading) {
    return <div className="spinner-container">Loading...</div>;
  }
  
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route 
          path="/login" 
          element={
            isAuthenticated ? 
            <Navigate to="/dashboard" /> : 
            <Login />
          } 
        />
        
        {/* Protected Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout isAuthenticated={isAuthenticated} user={user} logout={logout}>
                <Dashboard />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/babysitters" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout isAuthenticated={isAuthenticated} user={user} logout={logout}>
                <BabysitterManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/children" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout isAuthenticated={isAuthenticated} user={user} logout={logout}>
                <ChildManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/attendance" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout isAuthenticated={isAuthenticated} user={user} logout={logout}>
                <AttendanceTracking />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/incidents" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <DashboardLayout isAuthenticated={isAuthenticated} user={user} logout={logout}>
                <IncidentReporting />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        <Route 
          path="/finances" 
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated} requiredRole="manager">
              <DashboardLayout isAuthenticated={isAuthenticated} user={user} logout={logout}>
                <FinancialManagement />
              </DashboardLayout>
            </ProtectedRoute>
          } 
        />
        
        {/* Default Route */}
        <Route 
          path="/" 
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />} 
        />
        
        {/* 404 Route */}
        <Route 
          path="*" 
          element={
            <DashboardLayout isAuthenticated={isAuthenticated} user={user} logout={logout}>
              <div className="text-center mt-5">
                <h2>404 - Page Not Found</h2>
                <p>The page you are looking for does not exist.</p>
              </div>
            </DashboardLayout>
          } 
        />
      </Routes>
    </Router>
  );
}

// Protected Route Component
const ProtectedRoute = ({ children, isAuthenticated, requiredRole }) => {
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  // Role-based access control (if requiredRole is specified)
  if (requiredRole && children.props.user?.role !== requiredRole) {
    return (
      <DashboardLayout isAuthenticated={isAuthenticated} user={children.props.user} logout={children.props.logout}>
        <div className="text-center mt-5">
          <h2>Access Denied</h2>
          <p>You do not have permission to access this page.</p>
        </div>
      </DashboardLayout>
    );
  }
  
  return children;
};

export default App;