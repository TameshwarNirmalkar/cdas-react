
import { Route, Routes, useNavigate } from 'react-router-dom';
import './App.css'
import { useEffect, useState } from 'react';
import ProtectedRoute from './ProtectedRouteWrapper';
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
    setIsAuthenticated(false);
    navigate('/login');
  };

  useEffect(() => {
    console.log("=====> app state", isAuthenticated);
  }, [])
  

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
        <Route index element={<CreateDocument />} />
        <Route path="settings" element={<Settings />} /> 
        </Route>
      </Routes> 
    </>
  )
}

export default App
