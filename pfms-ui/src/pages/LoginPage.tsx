import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../services/api';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/budget');
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container max-w-md mx-auto p-6 bg-gray-800 rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>

      {error && (
        <div className="error-message bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-blue-400"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="mt-4 text-center text-gray-400">
        Don't have an account?{' '}
        <a href="/register" className="text-blue-400 hover:text-blue-300">
          Register here
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
