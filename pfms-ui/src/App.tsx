import './styles/index.css';
import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BudgetPage from './pages/BudgetPage';
import ArchitecturePage from './pages/ArchitecturePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import SessionExpiredPage from './pages/SessionExpiredPage';
import InvalidSignaturePage from './pages/InvalidSignaturePage';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';
import { getAuthToken } from './services/api';
import DashboardMonitor from './components/DashboardMonitor';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const isAuthenticated = !!getAuthToken();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  useEffect(() => {
    // Handle any MetaMask-related errors that might occur
    const handleMetaMaskError = (event: ErrorEvent) => {
      if (event.message.includes('MetaMask') || event.message.includes('ethereum')) {
        console.warn('MetaMask error detected but ignored (PFMS does not require MetaMask)');
        event.preventDefault(); // Prevent the error from showing in console
      }
    };

    window.addEventListener('error', handleMetaMaskError);
    return () => {
      window.removeEventListener('error', handleMetaMaskError);
    };
  }, []);

  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/session-expired" element={<SessionExpiredPage />} />
          <Route path="/invalid-signature" element={<InvalidSignaturePage />} />
          <Route path="/budget" element={
            <PrivateRoute>
              <BudgetPage />
            </PrivateRoute>
          } />
          <Route path="/dashboard" element={
            <PrivateRoute>
              <DashboardMonitor />
            </PrivateRoute>
          } />
          <Route path="/" element={
            <PrivateRoute>
              <BudgetPage />
            </PrivateRoute>
          } />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
