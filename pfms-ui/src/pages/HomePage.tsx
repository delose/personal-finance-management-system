import React from 'react';
import BaseLayout from '../components/BaseLayout';

const HomePage: React.FC = () => {
  return (
    <BaseLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div className="space-y-5">
          <h1 className="text-5xl font-bold">Manage and Track Your Finances Seamlessly</h1>
          <p className="text-lg">
            PFMS helps you take control of your finances with ease. Create budgets, track expenses, set financial goals, and generate comprehensive reports—all in one place.
          </p>
          <div className="flex items-center">
            <button className="btn btn-primary btn-lg ml-3">Start Managing Now</button>
          </div>
        </div>
        <div className="bg-gray-800 rounded-lg p-5">
            <img 
                src="/pfms-illustration.jpg"  // Correct path
                alt="PFMS Dashboard Preview" 
                className="rounded-lg shadow-lg"
            />
        </div>
      </div>
    </BaseLayout>
  );
};

export default HomePage;