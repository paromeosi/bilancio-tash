import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './components/dashboard/Dashboard';
import Login from './components/auth/Login';

// Componente per proteggere le route
const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-gray-50">
        <Router>
          <Routes>
            <Route 
              path="/login" 
              element={<Login />} 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="*"
              element={<Navigate to="/" replace />}
            />
          </Routes>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;