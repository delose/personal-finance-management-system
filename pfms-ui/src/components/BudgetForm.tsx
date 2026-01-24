import React, { useState } from 'react';
import { createBudget } from '../services/api';
import { getAuthToken } from '../services/api';
import { motion } from 'framer-motion';

interface BudgetFormProps {
  onBudgetCreated: () => void;
}

const BudgetForm: React.FC<BudgetFormProps> = ({ onBudgetCreated }) => {
  const [formData, setFormData] = useState({
    category: '',
    amount: 0,
    startDate: '',
    endDate: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      // Get user ID from token (this would be better handled by decoding the JWT)
      // For now, we'll use a placeholder user ID
      const userId = 1; // This should be extracted from the JWT in a real app

      // Transform the form data to match the API's expected format
      const budgetData = {
        category: formData.category.toUpperCase(), // API expects uppercase category
        amount: formData.amount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        userId: userId // API expects userId as string
      };

      await createBudget(budgetData);
      setSuccess(true);
      setFormData({
        category: '',
        amount: 0,
        startDate: '',
        endDate: ''
      });

      // Refresh the budget list
      onBudgetCreated();

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to create budget. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 rounded-lg p-6 mb-6"
    >
      <h3 className="text-xl font-semibold mb-4">Create New Budget</h3>

      {error && (
        <div className="bg-red-500 text-white p-3 rounded mb-4">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          Budget created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., GROCERIES"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Amount</label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
            placeholder="e.g., 450.75"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">End Date</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              required
              className="w-full p-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors disabled:bg-blue-400"
        >
          {loading ? 'Creating...' : 'Create Budget'}
        </button>
      </form>
    </motion.div>
  );
};

export default BudgetForm;
