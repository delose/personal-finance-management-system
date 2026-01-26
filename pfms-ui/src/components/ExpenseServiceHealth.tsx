import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaHeartbeat, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

interface HealthStatus {
  status: 'healthy' | 'unhealthy' | 'loading';
  latency: number | null;
  lastChecked: Date | null;
}

const ExpenseServiceHealth: React.FC = () => {
  const [health, setHealth] = useState<HealthStatus>({
    status: 'loading',
    latency: null,
    lastChecked: null,
  });

  const checkHealth = async () => {
    setHealth(prev => ({ ...prev, status: 'loading' }));
    const startTime = performance.now();

    try {
      const response = await fetch('http://localhost/api/health', {
        method: 'GET',
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);

      if (response.ok) {
        setHealth({
          status: 'healthy',
          latency,
          lastChecked: new Date(),
        });
      } else {
        setHealth({
          status: 'unhealthy',
          latency,
          lastChecked: new Date(),
        });
      }
    } catch (error) {
      const endTime = performance.now();
      const latency = Math.round(endTime - startTime);
      
      setHealth({
        status: 'unhealthy',
        latency,
        lastChecked: new Date(),
      });
    }
  };

  useEffect(() => {
    checkHealth();
    const interval = setInterval(checkHealth, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = () => {
    switch (health.status) {
      case 'healthy': return 'text-green-400';
      case 'unhealthy': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = () => {
    switch (health.status) {
      case 'healthy': return <FaCheckCircle className="text-green-400" />;
      case 'unhealthy': return <FaExclamationTriangle className="text-red-400" />;
      default: return <FaHeartbeat className="text-gray-400 animate-pulse" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-gray-800 rounded-lg p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-purple-300">
          <FaHeartbeat className="inline mr-2" />
          Expense Service Health
        </h2>
        <button
          onClick={checkHealth}
          disabled={health.status === 'loading'}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {health.status === 'loading' ? 'Checking...' : 'Check Now'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-900 rounded-lg p-4 flex items-center space-x-4">
          <div className="text-3xl">{getStatusIcon()}</div>
          <div>
            <p className="text-gray-400 text-sm">Status</p>
            <p className={`text-xl font-bold ${getStatusColor()}`}>
              {health.status === 'healthy' ? 'Healthy' : health.status === 'unhealthy' ? 'Unhealthy' : 'Checking...'}
            </p>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Response Time</p>
          <p className="text-xl font-bold text-white">
            {health.latency !== null ? `${health.latency}ms` : '--'}
          </p>
        </div>

        <div className="bg-gray-900 rounded-lg p-4">
          <p className="text-gray-400 text-sm">Last Checked</p>
          <p className="text-xl font-bold text-white">
            {health.lastChecked 
              ? health.lastChecked.toLocaleTimeString() 
              : 'Never'
            }
          </p>
        </div>
      </div>

      {health.status === 'unhealthy' && (
        <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg">
          <p className="text-red-300 text-sm">
            <FaExclamationTriangle className="inline mr-2" />
            The expense service appears to be unavailable. Please check the service status or try again later.
          </p>
        </div>
      )}
    </motion.div>
  );
};

export default ExpenseServiceHealth;
