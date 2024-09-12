import React from 'react';
import BaseLayout from '../components/BaseLayout';

const BudgetPage: React.FC = () => {
  return (
    <BaseLayout>
      <h1 className="text-4xl font-bold mb-5">Manage Your Budget</h1>
      <form className="bg-gray-800 p-5 rounded-lg shadow-lg space-y-4">
        <div>
          <label className="block text-sm font-medium">Budget Name</label>
          <input 
            type="text" 
            placeholder="Enter budget name" 
            className="input input-bordered w-full" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Amount</label>
          <input 
            type="number" 
            placeholder="Enter amount" 
            className="input input-bordered w-full" 
          />
        </div>
        <button className="btn btn-primary w-full">Create Budget</button>
      </form>
    </BaseLayout>
  );
};

export default BudgetPage;