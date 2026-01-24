import React, { useState, useEffect } from 'react';
import BaseLayout from '../components/BaseLayout';
import axios from 'axios';
import UserProfile from '../components/UserProfile';
import BudgetServiceHealth from '../components/BudgetServiceHealth';
import BudgetForm from '../components/BudgetForm';

// Move the helper functions outside the component
const getCurrentMonthYear = () => {
  const now = new Date();
  return now.toLocaleString('default', { month: 'long', year: 'numeric' });
};

const getMonthOptions = () => {
  const months = [];
  const now = new Date();

  // Generate months for the current year and next year
  for (let i = -6; i <= 6; i++) {
    const date = new Date();
    date.setMonth(now.getMonth() + i);
    months.push(
      date.toLocaleString('default', { month: 'long', year: 'numeric' })
    );
  }

  return months;
};

interface Budget {
  id: number;
  userId: string;
  category: string;
  amount: number;
  startDate: string;
  endDate: string;
  budgeted?: number;
  spent?: number;
}

const BudgetPage: React.FC = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [month, setMonth] = useState<string>(getCurrentMonthYear());
  const [refreshTrigger, setRefreshTrigger] = useState(false);
  const monthOptions = getMonthOptions();

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          throw new Error('No authentication token found');
        }

        // Parse month/year from the selected month string
        const [monthName, year] = month.split(' ');
        const monthIndex = new Date(`${monthName} 1, 2021`).getMonth();

        const response = await axios.get('http://localhost:8080/v1/api/budgets', {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          params: {
            year: year,
            month: monthIndex + 1 // Months are 1-12 in API
          }
        });

        // Transform the API response to match our UI format
        const transformedBudgets = response.data.map((budget: any) => ({
          ...budget,
          budgeted: budget.amount,
          spent: budget.spent || 0 // Add spent field with default 0 if not provided
        }));

        setBudgets(transformedBudgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
        // Fallback to mock data if API fails
        setBudgets([
          { id: 1, userId: "1", category: "Groceries", amount: 500, budgeted: 500, spent: 320, startDate: "2025-01-01", endDate: "2025-01-31" },
          { id: 2, userId: "1", category: "Transport", amount: 200, budgeted: 200, spent: 180, startDate: "2025-01-01", endDate: "2025-01-31" },
          { id: 3, userId: "1", category: "Entertainment", amount: 150, budgeted: 150, spent: 120, startDate: "2025-01-01", endDate: "2025-01-31" },
          { id: 4, userId: "1", category: "Utilities", amount: 300, budgeted: 300, spent: 280, startDate: "2025-01-01", endDate: "2025-01-31" }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [month, refreshTrigger]);

  const handleBudgetCreated = () => {
    setRefreshTrigger(!refreshTrigger);
  };

  const getRemaining = (budgeted: number, spent: number): number => {
    return budgeted - spent;
  };

  const getRemainingColor = (remaining: number, budgeted: number): string => {
    if (remaining < 0) return 'text-red-500';
    if (remaining < budgeted * 0.2) return 'text-yellow-500';
    return 'text-green-500';
  };

  if (loading) {
    return (
      <BaseLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </BaseLayout>
    );
  }

  return (
    <BaseLayout>
      <div className="max-w-4xl mx-auto">
        {/* Month selector */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Budgets</h1>
          <div className="flex items-center space-x-2">
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-sm"
            >
              {monthOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button
              onClick={() => setMonth(getCurrentMonthYear())}
              className="text-blue-400 hover:text-blue-300 text-sm"
            >
              Today
            </button>
          </div>
        </div>

        {/* Budget Service Health Checker */}
        <div className="mb-6">
          <BudgetServiceHealth />
        </div>

        {/* Budget Form */}
        <div className="mb-6">
          <BudgetForm onBudgetCreated={handleBudgetCreated} />
        </div>

        {/* Budget table */}
        <div className="bg-gray-800 rounded-lg overflow-hidden shadow">
          <div className="grid grid-cols-4 gap-4 p-4 font-semibold text-gray-300 border-b border-gray-700">
            <div>Category</div>
            <div>Budgeted</div>
            <div>Spent</div>
            <div>Remaining</div>
          </div>

          {budgets.length === 0 ? (
            <div className="p-6 text-center text-gray-400">
              No budgets found. Add your first budget!
            </div>
          ) : (
            budgets.map((budget) => {
              // Use the transformed budgeted and spent values
              const budgeted = budget.budgeted || 0;
              const spent = budget.spent || 0;
              const remaining = budgeted - spent;

              return (
                <div
                  key={budget.id}
                  className="grid grid-cols-4 gap-4 p-4 border-b border-gray-700 last:border-0 hover:bg-gray-700 transition-colors"
                >
                  <div className="font-medium">{budget.category}</div>
                  <div>${budgeted.toFixed(2)}</div>
                  <div>${spent.toFixed(2)}</div>
                  <div className={getRemainingColor(remaining, budgeted)}>
                    ${remaining.toFixed(2)}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* User Profile Section */}
        <div className="mt-8">
          <UserProfile />
        </div>
      </div>
    </BaseLayout>
  );
};

export default BudgetPage;

function getAuthToken(): string | null {
  return localStorage.getItem('authToken');
}
