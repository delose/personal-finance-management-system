import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-white text-2xl font-bold">
          <a href="/">PFMS</a>
        </div>
        <nav className="flex space-x-4">
          <a href="/dashboard" className="text-white">Dashboard</a>
          <a href="/budget" className="text-white">Budget</a>
          <a href="/expenses" className="text-white">Expenses</a>
          <a href="/goals" className="text-white">Goals</a>
          <a href="/reports" className="text-white">Reports</a>
          <a href="/login" className="btn btn-outline btn-sm text-white">Log In</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;