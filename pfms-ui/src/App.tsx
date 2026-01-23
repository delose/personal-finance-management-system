import './styles/index.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BudgetPage from './pages/BudgetPage';
import ArchitecturePage from './pages/ArchitecturePage';
import Header from './components/Header';
import { AuthProvider } from './context/AuthContext';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Header />
        <Routes>
          <Route path="/architecture" element={<ArchitecturePage />} />
          <Route path="/budget" element={<BudgetPage />} />
          <Route path="/" element={<ArchitecturePage />} />
          {/* Add more routes as needed */}
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
