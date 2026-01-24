import React, { useState, useEffect } from 'react';
import { createBudget, getBudgetCategories } from '../services/api';
import { getAuthToken } from '../services/api';
import { motion } from 'framer-motion';
import { FaSearch } from 'react-icons/fa';

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
  const [categories, setCategories] = useState<string[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    // Fetch categories when component mounts
    const fetchCategories = async () => {
      try {
        const cats = await getBudgetCategories();
        setCategories(cats);
        setFilteredCategories(cats);
      } catch (err) {
        console.error('Failed to load categories:', err);
        // Fallback to default categories
        setCategories([
          'GROCERIES', 'UTILITIES', 'RENT', 'TRAVEL',
          'FOOD', 'ENTERTAINMENT', 'DINING', 'SHOPPING', 'OTHER'
        ]);
        setFilteredCategories([
          'GROCERIES', 'UTILITIES', 'RENT', 'TRAVEL',
          'FOOD', 'ENTERTAINMENT', 'DINING', 'SHOPPING', 'OTHER'
        ]);
      }
    };

    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        [name]: value.toUpperCase()
      }));

      // Filter categories based on input
      const filtered = categories.filter(cat =>
        cat.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCategories(filtered);
      setShowSuggestions(value.length > 0 && filtered.length > 0);
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: name === 'amount' ? parseFloat(value) : value
      }));
    }
  };

  const handleCategorySelect = (category: string) => {
    setFormData(prev => ({
      ...prev,
      category: category
    }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    try {
      const userId = 1; // This should be extracted from the JWT in a real app

      const budgetData = {
        category: formData.category.toUpperCase(),
        amount: formData.amount,
        startDate: formData.startDate,
        endDate: formData.endDate,
        userId: userId
      };

      await createBudget(budgetData);
      setSuccess(true);
      setFormData({
        category: '',
        amount: 0,
        startDate: '',
        endDate: ''
      });

      onBudgetCreated();
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
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Category</label>
          <div className="relative">
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              onFocus={() => setShowSuggestions(formData.category.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              required
              className="w-full p-2 pl-10 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 focus:outline-none"
              placeholder="e.g., GROCERIES"
            />
            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          </div>

          {/* Category suggestions dropdown */}
          {showSuggestions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute z-10 w-full mt-1 bg-gray-700 rounded-md shadow-lg max-h-40 overflow-y-auto"
            >
              {filteredCategories.map(category => (
                <div
                  key={category}
                  className="p-2 hover:bg-gray-600 cursor-pointer"
                  onClick={() => handleCategorySelect(category)}
                >
                  {category.charAt(0) + category.slice(1).toLowerCase()}
                </div>
              ))}
            </motion.div>
          )}
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
