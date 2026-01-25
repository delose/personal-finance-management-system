import React from 'react';
import { getAuthToken, logout } from '../services/api';
import { useNavigate } from 'react-router-dom';

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isAuthenticated = !!getAuthToken();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <a href="/">PFMS</a>
        </div>
        <nav className="flex space-x-4">
          {isAuthenticated ? (
            <>
              <a href="/dashboard" className="text-white">Dashboard</a>
              <a href="/budget" className="text-white">Budget</a>
              <a href="/expenses" className="text-white">Expenses</a>
              <a href="/goals" className="text-white">Goals</a>
              <a href="/reports" className="text-white">Reports</a>
              <button
                onClick={handleLogout}
                className="btn btn-outline btn-sm text-white hover:bg-red-600 hover:border-red-600"
              >
                Log Out
              </button>
            </>
          ) : (
            <>
              <a href="/login" className="btn btn-outline btn-sm text-white">Log In</a>
              <a href="/register" className="btn btn-outline btn-sm text-white">Register</a>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
