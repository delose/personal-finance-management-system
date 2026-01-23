import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import {
  FaServer, FaDatabase, FaNetworkWired, FaCog, FaExchangeAlt
} from 'react-icons/fa';
import {
  FaTimes, FaExternalLinkAlt, FaClipboard, FaCheck
} from 'react-icons/fa';

interface Service {
  id: string;
  name: string;
  type: string;
  language: string;
  port: number;
  database?: string;
  health: 'UP' | 'DOWN' | 'DEGRADED' | 'UNKNOWN';
  responseTime?: number;
  lastUpdated?: string;
  endpoints?: {
    health?: string;
    logs?: string;
    dashboard?: string;
  };
}

interface ServiceModalProps {
  service: Service;
  onClose: () => void;
}

const serviceIcons: Record<string, JSX.Element> = {
  'gateway': <FaNetworkWired className="text-3xl mb-4" />,
  'service': <FaServer className="text-3xl mb-4" />,
  'database': <FaDatabase className="text-3xl mb-4" />,
  'messaging': <FaExchangeAlt className="text-3xl mb-4" />,
  'discovery': <FaCog className="text-3xl mb-4" />,
  'default': <FaServer className="text-3xl mb-4" />
};

const getHealthColor = (health: string) => {
  switch (health) {
    case 'UP': return 'bg-green-500';
    case 'DEGRADED': return 'bg-yellow-500';
    case 'DOWN': return 'bg-red-500';
    default: return 'bg-gray-500';
  }
};

const ServiceModal: React.FC<ServiceModalProps> = ({ service, onClose }) => {
  const [logs, setLogs] = useState<string[]>([]);
  const [loadingLogs, setLoadingLogs] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (service.endpoints?.logs) {
      fetchLogs();
    }
  }, [service]);

  const fetchLogs = async () => {
    setLoadingLogs(true);
    try {
      // In a real implementation, this would fetch from the actual logs endpoint
      // For demo purposes, we'll simulate some log data
      const simulatedLogs = [
        `[INFO] Starting ${service.name} on port ${service.port}`,
        `[INFO] Database connection established`,
        `[INFO] Health check endpoint available at /health`,
        `[INFO] Service registered with discovery server`,
        `[INFO] Ready to accept requests`,
        `[DEBUG] Processing request to /api/${service.id.toLowerCase()}`,
        `[INFO] Successfully handled 100 requests`,
        `[WARN] High memory usage detected`,
        `[INFO] Garbage collection completed`,
        `[INFO] Service running smoothly`
      ];
      setLogs(simulatedLogs);
    } catch (error) {
      console.error('Failed to fetch logs:', error);
      setLogs(['Failed to fetch logs. Please try again later.']);
    } finally {
      setLoadingLogs(false);
    }
  };

  const copyToClipboard = () => {
    const modalContent = document.getElementById('service-modal-content');
    if (modalContent) {
      navigator.clipboard.writeText(modalContent.innerText)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
        id="service-modal-content"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              {serviceIcons[service.type] || serviceIcons['default']}
              <span className="ml-2">{service.name}</span>
            </h2>
            <div className={`inline-block px-2 py-1 rounded text-xs font-semibold ${getHealthColor(service.health)} mt-2`}>
              {service.health}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold mb-2">Service Information</h3>
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Type:</span> {service.type}</div>
              <div><span className="text-gray-400">Language:</span> {service.language}</div>
              <div><span className="text-gray-400">Port:</span> {service.port}</div>
              {service.database && <div><span className="text-gray-400">Database:</span> {service.database}</div>}
              {service.responseTime && <div><span className="text-gray-400">Response Time:</span> {service.responseTime}ms</div>}
              {service.lastUpdated && <div><span className="text-gray-400">Last Updated:</span> {new Date(service.lastUpdated).toLocaleString()}</div>}
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Endpoints</h3>
            <div className="space-y-2 text-sm">
              {service.endpoints?.health && (
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Health:</span>
                  <a
                    href={service.endpoints.health}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    {service.endpoints.health}
                    <FaExternalLinkAlt className="ml-1" />
                  </a>
                </div>
              )}
              {service.endpoints?.dashboard && (
                <div className="flex items-center">
                  <span className="text-gray-400 mr-2">Dashboard:</span>
                  <a
                    href={service.endpoints.dashboard}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 flex items-center"
                  >
                    {service.endpoints.dashboard}
                    <FaExternalLinkAlt className="ml-1" />
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Logs Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold">Recent Logs</h3>
            <button
              onClick={copyToClipboard}
              className="text-blue-400 hover:text-blue-300 flex items-center text-sm"
            >
              {copied ? <FaCheck className="mr-1" /> : <FaClipboard className="mr-1" />}
              {copied ? 'Copied!' : 'Copy Logs'}
            </button>
          </div>
          <div className="bg-gray-900 rounded p-4 max-h-64 overflow-y-auto">
            {loadingLogs ? (
              <div className="text-gray-400">Loading logs...</div>
            ) : logs.length > 0 ? (
              logs.map((log, index) => (
                <div key={index} className="text-sm text-gray-300 mb-1">
                  {log}
                </div>
              ))
            ) : (
              <div className="text-gray-400">No logs available</div>
            )}
          </div>
        </div>

        {/* Health Details */}
        <div>
          <h3 className="font-semibold mb-2">Health Details</h3>
          <div className="bg-gray-900 rounded p-4">
            <div className="space-y-2 text-sm">
              <div><span className="text-gray-400">Status:</span> {service.health}</div>
              <div><span className="text-gray-400">Last Check:</span> {service.lastUpdated || 'Never'}</div>
              {service.responseTime && (
                <div>
                  <span className="text-gray-400">Response Time:</span> {service.responseTime}ms
                  <span className={`ml-2 inline-block px-2 py-1 rounded text-xs ${service.responseTime < 100 ? 'bg-green-500' : service.responseTime < 500 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                    {service.responseTime < 100 ? 'Fast' : service.responseTime < 500 ? 'Normal' : 'Slow'}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Close button */}
        <div className="flex justify-end mt-6">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ServiceModal;
