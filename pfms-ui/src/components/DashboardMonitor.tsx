import React, { useState, useEffect } from 'react';
import { getAuthToken } from '../services/api';
import axios from 'axios';
import BaseLayout from './BaseLayout';

interface Metric {
  name: string;
  value: string;
}

const DashboardMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<Metric[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('Authentication required');
        }

        const response = await axios.get('http://localhost:8080/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        // Parse the HTML response to extract metrics
        const parser = new DOMParser();
        const doc = parser.parseFromString(response.data, 'text/html');
        const rows = doc.querySelectorAll('tbody tr');

        const extractedMetrics: Metric[] = [];
        rows.forEach(row => {
          const cells = row.querySelectorAll('td');
          if (cells.length >= 2) {
            extractedMetrics.push({
              name: cells[0].textContent || '',
              value: cells[1].textContent || ''
            });
          }
        });

        setMetrics(extractedMetrics);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </BaseLayout>
    );
  }

  if (error) {
    return (
      <BaseLayout>
        <div className="bg-red-500 text-white p-4 rounded-lg">
          {error}
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">API Gateway Monitor</h1>

        <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
          <table className="w-full">
            <thead className="bg-blue-600 text-white">
              <tr>
                <th className="text-left p-4">Metric</th>
                <th className="text-left p-4">Value</th>
              </tr>
            </thead>
            <tbody>
              {metrics.map((metric, index) => (
                <tr key={index} className="border-b border-gray-700 hover:bg-gray-700">
                  <td className="p-4">{metric.name}</td>
                  <td className="p-4">{metric.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6">
          <a
            href="http://localhost:8080/actuator"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
          >
            Raw Actuator Endpoints
          </a>
        </div>
      </div>
    </BaseLayout>
  );
};

export default DashboardMonitor;
