import React from 'react';
import BaseLayout from '../components/BaseLayout';
import { motion } from 'framer-motion';
import { FaBullseye, FaChartLine, FaCalendarAlt, FaTrophy } from 'react-icons/fa';

const GoalsPage: React.FC = () => {
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
            className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent"
          >
            Financial Goals
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-300"
          >
            Set, track, and achieve your financial aspirations
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
            <div className="text-4xl mb-4 text-green-400">
              <FaBullseye />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Targets</h3>
            <p className="text-gray-400 text-sm">
              Set achievable goals with intelligent recommendations
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4 text-blue-400">
              <FaChartLine />
            </div>
            <h3 className="text-xl font-semibold mb-2">Progress Tracking</h3>
            <p className="text-gray-400 text-sm">
              Visualize your journey with interactive progress charts
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-gray-800 rounded-lg p-6 text-center hover:bg-gray-750 transition-colors"
          >
            <div className="text-4xl mb-4 text-yellow-400">
              <FaTrophy />
            </div>
            <h3 className="text-xl font-semibold mb-2">Achievement System</h3>
            <p className="text-gray-400 text-sm">
              Earn badges and celebrate milestones along the way
            </p>
          </motion.div>
        </div>

        {/* Coming Soon Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 rounded-lg p-8 text-center"
        >
          <h2 className="text-3xl font-bold mb-4 text-green-300">Coming Soon</h2>
          <p className="text-gray-300 text-lg mb-6">
            The Goals module is currently under development. We're building a powerful system to help you achieve your financial dreams.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition-colors"
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
                  <h4 className="font-semibold">Multiple Goal Types</h4>
                  <p className="text-gray-400 text-sm">Save for emergencies, vacations, home purchases, or retirement</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Automated Contributions</h4>
                  <p className="text-gray-400 text-sm">Set up automatic transfers to your goal accounts</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Smart Suggestions</h4>
                  <p className="text-gray-400 text-sm">Get personalized recommendations based on your spending</p>
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Milestone Celebrations</h4>
                  <p className="text-gray-400 text-sm">Track progress with visual milestones and achievements</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Budget Integration</h4>
                  <p className="text-gray-400 text-sm">See how goals fit into your overall budget plan</p>
                </div>
              </div>
              <div className="flex items-start">
                <span className="text-green-400 mr-3">✓</span>
                <div>
                  <h4 className="font-semibold">Family Goals</h4>
                  <p className="text-gray-400 text-sm">Collaborate on shared goals with family members</p>
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
            Want to be notified when Goals launches?
          </p>
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition-colors"
            onClick={() => alert('Thanks for your interest! We\'ll notify you when Goals is ready.')}
          >
            Get Notified
          </button>
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default GoalsPage;
