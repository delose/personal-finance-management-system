import React, { useState, ChangeEvent, FormEvent } from 'react';

// Define the Budget type
interface Budget {
    name: string;
    amount: number;
}

// React Functional Component
const BudgetForm: React.FC = () => {
    // State to hold the budget details
    const [budget, setBudget] = useState<Budget>({ name: '', amount: 0 });
    const [loading, setLoading] = useState<boolean>(false);
    const [message, setMessage] = useState<string>('');

    // Handle form submission
    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage('');

        try {
            await createBudget(budget);
            setMessage('Budget created successfully!');
        } catch (error) {
            setMessage('Failed to create budget. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Handle input changes
    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setBudget(prevBudget => ({
            ...prevBudget,
            [name]: name === 'amount' ? parseFloat(value) : value
        }));
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Budget Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={budget.name}
                        onChange={handleInputChange}
                        placeholder="Budget Name"
                    />
                </div>
                <div>
                    <label>Budget Amount:</label>
                    <input
                        type="number"
                        name="amount"
                        value={budget.amount}
                        onChange={handleInputChange}
                        placeholder="Budget Amount"
                    />
                </div>
                <button type="submit" disabled={loading}>Create Budget</button>
            </form>
            {loading && <p>Loading...</p>}
            {message && <p>{message}</p>}
        </div>
    );
};

export default BudgetForm;

function createBudget(budget: Budget) {
    throw new Error('Function not implemented.');
}
