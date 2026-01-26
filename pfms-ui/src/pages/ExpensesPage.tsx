import React, { useState, useEffect } from 'react';
import BaseLayout from '../components/BaseLayout';
import { motion } from 'framer-motion';
import { FaReceipt, FaChartLine, FaCalendarAlt, FaPlus, FaList } from 'react-icons/fa';
import ExpenseServiceHealth from '../components/ExpenseServiceHealth';

interface Expense {
  id: number;
  title: string;
  amount: string;
  category: string;
  entry_date: string;
  created_at: string;
  updated_at: string;
}

const ExpensesPage: React.FC = () => {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    category: '',
    entry_date: ''
  });

  // Fetch expenses on mount
  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const response = await fetch('http://localhost/api/expenses');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // Parse the response as JSON directly
      const data = await response.json();
      console.log("fetchExpenses response data:", data);
      setExpenses(data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      setError('Failed to fetch expenses');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          amount: parseFloat(formData.amount),
          category: formData.category,
          entry_date: formData.entry_date
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setSuccess('Expense created successfully!');
      setFormData({
        title: '',
        amount: '',
        category: '',
        entry_date: ''
      });
      
      // Refresh the expenses list
      fetchExpenses();
    } catch (err) {
      console.error('Error creating expense:', err);
      setError('Failed to create expense. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <BaseLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header Section */}
        <div className="text-center mb-8">
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

        {/* API Test Section */}
        <ExpenseServiceHealth />

        {/* Existing Expenses Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-800 rounded-lg p-6"
        >
          <h2 className="text-2xl font-bold mb-4 text-green-300">
            <FaList className="inline mr-2" />
            Existing Expenses
          </h2>

          {expenses.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No expenses found. Create your first expense above!</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="p-2 text-gray-300">ID</th>
                    <th className="p-2 text-gray-300">Title</th>
                    <th className="p-2 text-gray-300">Amount</th>
                    <th className="p-2 text-gray-300">Category</th>
                    <th className="p-2 text-gray-300">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {expenses.map((expense) => (
                    <tr key={expense.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="p-2 text-gray-400">{expense.id}</td>
                      <td className="p-2 text-white">{expense.title}</td>
                      <td className="p-2 text-green-400">${parseFloat(expense.amount).toFixed(2)}</td>
                      <td className="p-2 text-blue-400">{expense.category}</td>
                      <td className="p-2 text-gray-400">{expense.entry_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Feature Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
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
            transition={{ delay: 0.6 }}
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
            transition={{ delay: 0.7 }}
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

        {/* API Endpoint Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-8 bg-gray-800 rounded-lg p-6"
        >
          <h3 className="text-xl font-bold mb-4 text-purple-300">API Endpoints</h3>
          <div className="space-y-4">
            <div>
              <div className="bg-gray-900 p-4 rounded font-mono text-sm text-green-400 mb-2">
                GET http://localhost/api/expenses
              </div>
              <p className="text-gray-400 text-sm">Fetch all expenses</p>
            </div>
            <div>
              <div className="bg-gray-900 p-4 rounded font-mono text-sm text-green-400 mb-2">
                POST http://localhost/api/expenses
              </div>
              <p className="text-gray-400 text-sm">Create a new expense</p>
              <pre className="bg-gray-900 p-4 rounded mt-2 text-xs">
{`{
  "title": "Coffee",
  "amount": 4.50,
  "category": "Food",
  "entry_date": "2026-01-13"
}`}
              </pre>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </BaseLayout>
  );
};

export default ExpensesPage;
