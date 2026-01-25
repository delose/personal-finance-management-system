import React from 'react';
import BaseLayout from '../components/BaseLayout';
import { motion } from 'framer-motion';
import { FaChartBar, FaFileAlt, FaCalendarAlt, FaDownload } from 'react-icons/fa';

const ReportsPage: React.FC = () => {
  return (
    <BaseLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent"
          >
            Financial Reports
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Generate comprehensive insights from your financial data
          </motion.p>
        </div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4 text-purple-400">
              <FaChartBar />
            </div>
            <h3 className="text-xl font-semibold mb-2">Visual Analytics</h3>
            <p className="text-gray-400 text-sm">
              Interactive charts and graphs for spending patterns
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4 text-pink-400">
              <FaFileAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2">Detailed Reports</h3>
            <p className="text-gray-400 text-sm">
              Generate PDF and Excel reports for any time period
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4 text-blue-400">
              <FaCalendarAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2">Scheduled Reports</h3>
            <p className="text-gray-400 text-sm">
              Set up automated report generation and delivery
            </p>
          </motion.div>
        </div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-purple-300">Coming Soon</h2>
          <p className="text-gray-300 text-lg mb-6">
            The Reports module is currently under development. We're building a powerful reporting engine to help you understand your financial health.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              onClick={() => window.location.href = '/budget'}
            >
              Explore Budgets Instead
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
              onClick={() => window.location.href = '/dashboard'}
            >
              Check Dashboard
            </button>
          </div>
        </motion.div>

        {/* Feature List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-12 bg-gray-800 rounded-lg p-8"
        >
          <h3 className="text-2xl font-bold mb-6 text-center">What to Expect</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Multi-Format Export</h4>
                  <p className="text-gray-400 text-sm">Export reports as PDF, Excel, CSV, or PNG</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Custom Date Ranges</h4>
                  <p className="text-gray-400 text-sm">Generate reports for any custom time period</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Tax Preparation</h4>
                  <p className="text-gray-400 text-sm">Tax-ready reports for easy filing</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Comparative Analysis</h4>
                  <p className="text-gray-400 text-sm">Compare spending across different periods</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Budget vs Actual</h4>
                  <p className="text-gray-400 text-sm">See how actual spending compares to budgets</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Scheduled Delivery</h4>
                  <p className="text-gray-400 text-sm">Get reports delivered to your inbox automatically</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">
            Want to be notified when Reports launches?
          </p>
          <button
            className="bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            onClick={() => alert('Thanks for your interest! We\'ll notify you when Reports is ready.')}
          >
            Get Notified
          </button>
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default ReportsPage;
