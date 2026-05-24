
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'
import { useState, memo } from 'react';
import { hasToken } from './auth';
import ProtectedRoute, { GuestRoute } from './ProtectedRouteWrapper';
import DashboardLayout from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';
import CreateDocument from './pages/CreateDocument';

;
const Settings = () => <h2>User Settings</h2>;


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(!!sessionStorage.getItem('token'));
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard');
  };

  const handleLogout = () => {
    sessionStorage.removeItem('token');
    setIsAuthenticated(false);
    navigate('/login');
  };

  return (
    <>      
      <Routes>
        <Route
          path="/"
          element={
            <Navigate
              to={isAuthenticated || hasToken() ? '/dashboard' : '/login'}
              replace
            />
          }
        />
        <Route
          path="/login"
          element={
            <GuestRoute isAuthenticated={isAuthenticated}>
              <LoginPage onLogin={handleLogin} />
            </GuestRoute>
          }
        />
      {/* Protected Dashboard Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DashboardLayout onLogout={handleLogout} />
        </ProtectedRoute>
      }>
        <Route index element={<CreateDocument />} />
        <Route path="settings" element={<Settings />} /> 
        </Route>
      </Routes> 
    </>
  )
}

export default memo(App)
