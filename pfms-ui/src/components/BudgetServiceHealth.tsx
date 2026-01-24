import React, { useState, useEffect } from 'react';
import { checkBudgetServiceHealth } from '../services/api';
import { motion } from 'framer-motion';

const BudgetServiceHealth: React.FC = () => {
  const [healthStatus, setHealthStatus] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastChecked, setLastChecked] = useState<string>('');

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await checkBudgetServiceHealth();
      setHealthStatus(response);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to check budget service health');
      }
      setHealthStatus('');
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (error) return 'bg-red-500';
    if (healthStatus.includes('Hello from')) return 'bg-green-500';
    return 'bg-gray-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-gray-800 rounded-lg p-4 mb-6"
    >
      <h3 className="text-lg font-semibold mb-3">Budget Service Health</h3>

      <div className="flex items-center space-x-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()} animate-pulse`}></div>

        {loading ? (
          <div className="text-gray-400">Checking...</div>
        ) : error ? (
          <div className="text-red-400">{error}</div>
        ) : (
          <div className="text-green-400">{healthStatus}</div>
        )}

        <button
          onClick={checkHealth}
          disabled={loading}
          className="text-blue-400 hover:text-blue-300 text-sm flex items-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Refresh
        </button>
      </div>

      <div className="text-xs text-gray-500 mt-2">
        Last checked: {lastChecked || 'Never'}
      </div>
    </motion.div>
  );
};

export default BudgetServiceHealth;
