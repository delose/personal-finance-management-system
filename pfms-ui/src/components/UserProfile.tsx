import React, { useState, useEffect } from 'react';
import { getCurrentUser } from '../services/api';

const UserProfile: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('Failed to load user data');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

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
      </div>
    </div>
  );
};

export default UserProfile;
