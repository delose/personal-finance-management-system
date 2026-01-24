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

// Login function
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await axios.post(`${API_GATEWAY_URL}/login`, {
      username: email,
      password: password
    });
    localStorage.setItem('authToken', response.data.token);
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
};

// Register function
export const register = async (email: string, password: string, fullName: string): Promise<void> => {
  try {
    const response = await axios.post(`${API_GATEWAY_URL}/auth/signup`, {
      email: email,
      password: password,
      fullName: fullName
    });
    return response.data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
};

// Get auth token helper
export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

// Logout function
export const logout = (): void => {
  localStorage.removeItem('authToken');
};
