import React from 'react';
import BaseLayout from '../components/BaseLayout';
import { motion } from 'framer-motion';
import { FaReceipt, FaChartLine, FaCalendarAlt } from 'react-icons/fa';

const ExpensesPage: React.FC = () => {
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
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
          >
            Expenses
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Track, categorize, and analyze your spending
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
            <div className="text-4xl mb-4 text-blue-400">
              <FaReceipt />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Receipts</h3>
            <p className="text-gray-400 text-sm">
              Upload receipts and let AI categorize them automatically
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4 text-green-400">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-semibold mb-2">Spending Analytics</h3>
            <p className="text-gray-400 text-sm">
              Visualize your spending patterns with interactive charts
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4 text-purple-400">
              <FaCalendarAlt />
            </div>
            <h3 className="text-xl font-semibold mb-2">Recurring Expenses</h3>
            <p className="text-gray-400 text-sm">
              Set up and manage recurring bills and subscriptions
            </p>
          </motion.div>
        </div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 border border-blue-500/30 rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-blue-300">Coming Soon</h2>
          <p className="text-gray-300 text-lg mb-6">
            The Expenses module is currently under development. We're working hard to bring you a powerful expense tracking solution.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
                  <h4 className="font-semibold">Multi-currency Support</h4>
                  <p className="text-gray-400 text-sm">Track expenses in any currency with automatic conversion</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Receipt Scanning</h4>
                  <p className="text-gray-400 text-sm">Upload photos of receipts for automatic data extraction</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Expense Reports</h4>
                  <p className="text-gray-400 text-sm">Generate detailed reports for tax season or business needs</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Budget Integration</h4>
                  <p className="text-gray-400 text-sm">See how actual spending compares to your budget goals</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Smart Categories</h4>
                  <p className="text-gray-400 text-sm">AI-powered categorization with custom rules</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Mobile App</h4>
                  <p className="text-gray-400 text-sm">Track expenses on the go with our mobile application</p>
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
            Want to be notified when Expenses launches?
          </p>
          <button
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            onClick={() => alert('Thanks for your interest! We\'ll notify you when Expenses is ready.')}
          >
            Get Notified
          </button>
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default ExpensesPage;
