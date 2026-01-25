import React from 'react';
import { useNavigate } from 'react-router-dom';
import BaseLayout from '../components/BaseLayout';
import { motion } from 'framer-motion';

const InvalidSignaturePage: React.FC = () => {
  const navigate = useNavigate();

  const handleGoToLogin = () => {
    // Clear any existing auth data
    localStorage.removeItem('authToken');
    localStorage.removeItem('tokenExpires');
    navigate('/login');
  };

  return (
    <BaseLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          {/* Security Alert Icon */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
            className="mb-6"
          >
            <div className="w-20 h-20 bg-yellow-500 rounded-full flex items-center justify-center mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-10 w-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              </svg>
            </div>
          </motion.div>

          {/* Error Message */}
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-yellow-400 mb-4"
          >
            Invalid Security Token
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-gray-300 text-lg mb-2"
          >
            The security token signature does not match. This could indicate:
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-gray-400 mb-8 text-left"
          >
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>The token has been tampered with or corrupted</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>The server's security key has changed</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>You're using an outdated or invalid token</span>
              </li>
              <li className="flex items-start">
                <span className="text-yellow-400 mr-2">•</span>
                <span>There's a configuration issue with the security system</span>
              </li>
            </ul>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <button
              onClick={handleGoToLogin}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
              Go to Login
            </button>

            <button
              onClick={() => navigate('/')}
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-6 rounded-lg transition-colors"
            >
              Go to Home
            </button>
          </motion.div>

          {/* Security Info */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-8 p-4 bg-gray-700 rounded-lg text-left"
          >
            <h3 className="font-semibold text-gray-300 mb-2">Security Notice</h3>
            <p className="text-gray-400 text-sm mb-2">
              For your protection, we've automatically cleared your authentication data. 
              Please log in again to generate a new secure token.
            </p>
            <p className="text-gray-400 text-sm">
              If this problem persists, please contact your system administrator.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </BaseLayout>
  );
};

export default InvalidSignaturePage;
