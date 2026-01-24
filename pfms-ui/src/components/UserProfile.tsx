import React, { useState, useEffect } from 'react';
import { getCurrentUser, getAuthToken, logout } from '../services/api';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [tokenExpires, setTokenExpires] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<string>('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Check token before making API call
        const token = getAuthToken();
        if (!token) {
          setError('Your session has expired. Please log in again.');
          setLoading(false);
          return;
        }

        const userData = await getCurrentUser();
        setUser(userData);

        // Set up token expiration monitoring
        const expiresAt = localStorage.getItem('tokenExpires');
        if (expiresAt) {
          const expires = new Date(parseInt(expiresAt));
          setTokenExpires(expires.toLocaleString());

          // Calculate time remaining with more frequent updates when close to expiry
          const calculateTimeRemaining = () => {
            const now = new Date().getTime();
            const diff = parseInt(expiresAt) - now;

            if (diff <= 0) {
              setTimeRemaining('Session expired');
              setError('Your session has expired. Please log in again.');
              logout();
              return;
            }

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            setTimeRemaining(`${hours}h ${minutes}m ${seconds}s remaining`);

            // Warn when less than 5 minutes remaining
            if (diff <= 300000 && diff > 0) {
              setError('Your session will expire soon. Please save your work.');
            }
          };

          // Update more frequently when close to expiry
          const updateInterval = Math.min(1000, Math.max(100, parseInt(expiresAt) - new Date().getTime() / 10));
          calculateTimeRemaining();
          const interval = setInterval(calculateTimeRemaining, updateInterval);

          return () => clearInterval(interval);
        }
      } catch (err) {
        if (err instanceof Error) {
          if (err.message.includes('token_expired') || err.message.includes('Session expired')) {
            setError('Your session has expired. Please log in again.');
            logout();
          } else {
            setError(err.message);
          }
        } else {
          setError('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const getTokenStatusColor = () => {
    if (!tokenExpires) return 'bg-gray-500';

    const expiresAt = localStorage.getItem('tokenExpires');
    if (!expiresAt) return 'bg-gray-500';

    const now = new Date().getTime();
    const diff = parseInt(expiresAt) - now;
    const minutesRemaining = Math.floor(diff / (1000 * 60));

    if (minutesRemaining <= 0) return 'bg-red-500';
    if (minutesRemaining <= 30) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500 text-white p-4 rounded-lg">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-gray-700 text-white p-4 rounded-lg">
        No user data available
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">User Profile</h2>

      <div className="space-y-3">
        <div>
          <span className="text-gray-400">Name:</span>
          <span className="ml-2 font-medium">{user.fullName}</span>
        </div>

        <div>
          <span className="text-gray-400">Email:</span>
          <span className="ml-2 font-medium">{user.email}</span>
        </div>

        <div>
          <span className="text-gray-400">Account Status:</span>
          <span className={`ml-2 inline-block px-2 py-1 rounded text-xs font-semibold ${
            user.enabled ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {user.enabled ? 'Active' : 'Disabled'}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Account Created:</span>
          <span className="ml-2 font-medium">
            {new Date(user.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div>
          <span className="text-gray-400">Last Updated:</span>
          <span className="ml-2 font-medium">
            {new Date(user.updateAt).toLocaleDateString()}
          </span>
        </div>

        {/* Token Expiry Information */}
        <div>
          <span className="text-gray-400">Token Status:</span>
          <span className={`ml-2 inline-block px-2 py-1 rounded text-xs font-semibold ${getTokenStatusColor()}`}>
            {timeRemaining || 'Unknown'}
          </span>
        </div>

        {tokenExpires && (
          <div>
            <span className="text-gray-400">Token Expires:</span>
            <span className="ml-2 font-medium">{tokenExpires}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
