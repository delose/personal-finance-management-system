import axios from 'axios';

// Define the base URL for the API Gateway
const API_GATEWAY_URL = 'http://localhost:8080';

// Define the Budget type
interface Budget {
    name: string;
    amount: number;
}

// Function to create a new budget by sending a request to the API Gateway
export const createBudget = async (budgetData: Budget): Promise<void> => {
    try {
        const response = await axios.post(`${API_GATEWAY_URL}/budget-service/budgets`, budgetData);
        return response.data;
    } catch (error) {
        console.error('Error creating budget:', error);
        throw error;
    }
};