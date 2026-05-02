
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'
import { useState } from 'react';
import ProtectedRoute from './ProtectedRouteWrapper';
import DashboardLayout from './pages/DashboardPage';
import LoginPage from './pages/LoginPage';

const Stats = () => <h2>Dashboard Overview</h2>;
const Settings = () => <h2>User Settings</h2>;


function App() {

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    setIsAuthenticated(true);
    navigate('/dashboard'); // Send user to dashboard after login
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/login');
  };
  

  return (
    <>      
      <Routes>
        <Route path="/login" element={
        <LoginPage onLogin={handleLogin} />
      } />
      {/* Protected Dashboard Route */}
      <Route path="/dashboard" element={
        <ProtectedRoute isAuthenticated={isAuthenticated}>
          <DashboardLayout onLogout={handleLogout} />
        </ProtectedRoute>
      }>
        <Route index element={<Stats />} /> {/* Matches "/dashboard" */}
        <Route path="settings" element={<Settings />} /> 
        </Route>
      </Routes> 
    </>
  )
}

export default App
