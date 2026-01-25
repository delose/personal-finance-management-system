import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define the base URL for the API Gateway
const API_GATEWAY_URL = 'http://localhost:8080';

// Define the Budget type
interface Budget {
    name: string;
    amount: number;
}

/**
 * Get all budget categories from the API
 * @returns Promise<string[]> - Array of budget category names
 */
export const getBudgetCategories = async (): Promise<string[]> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_GATEWAY_URL}/v1/api/budgets/categories`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch budget categories:', error);

    // Check if it's a 401 error (session expired or invalid signature)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const errorData = error.response.data;
      
      // Check for specific error codes
      if (errorData?.errorCode === 'error.auth.token_expired') {
        // Redirect to session expired page
        window.location.href = '/session-expired';
        throw new Error('Session expired. Redirecting to login...');
      } else if (errorData?.errorCode === 'error.auth.invalid_signature') {
        // Redirect to invalid signature page
        window.location.href = '/invalid-signature';
        throw new Error('Invalid security token. Redirecting to login...');
      } else {
        // Generic 401 error
        window.location.href = '/session-expired';
        throw new Error('Authentication failed. Redirecting to login...');
      }
    }

    // Fallback to default categories if API fails
    return [
      'GROCERIES', 'UTILITIES', 'RENT', 'TRAVEL',
      'FOOD', 'ENTERTAINMENT', 'DINING', 'SHOPPING', 'OTHER'
    ];
  }
};

// Enhanced token expiration check
export const isTokenExpired = (): boolean => {
  const expiresAt = localStorage.getItem('tokenExpires');
  if (!expiresAt) return true;

  try {
    const now = new Date().getTime();
    const expires = parseInt(expiresAt);
    return expires <= now;
  } catch (e) {
    console.error('Invalid token expiration format:', e);
    return true;
  }
};

// Enhanced getAuthToken with expiration check
export const getAuthToken = (): string | null => {
  const token = localStorage.getItem('authToken');
  if (!token || isTokenExpired()) {
    console.warn('Token expired or not found, clearing session...');
    logout();
    return null;
  }
  return token;
};

// Add this function to refresh the token (if your API supports it)
export const refreshToken = async (): Promise<void> => {
  try {
    const response = await axios.post(`${API_GATEWAY_URL}/auth/refresh`, {}, {
      headers: {
        'Authorization': `Bearer ${getAuthToken()}`
      }
    });

    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('tokenExpires', Date.now() + response.data.expiresIn);
  } catch (error) {
    console.error('Token refresh failed:', error);
    logout();
    throw new Error('Session expired. Please log in again.');
  }
};

// Create budget categories function

// Create budget function
export const createBudget = async (budgetData: {
  category: string;
  amount: number;
  startDate: string;
  endDate: string;
  userId: number;
}): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(`${API_GATEWAY_URL}/v1/api/budgets`, budgetData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to create budget:', error);

    // Check if it's a 401 error (session expired or invalid signature)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const errorData = error.response.data;
      
      // Check for specific error codes
      if (errorData?.errorCode === 'error.auth.token_expired') {
        // Redirect to session expired page
        window.location.href = '/session-expired';
        throw new Error('Session expired. Redirecting to login...');
      } else if (errorData?.errorCode === 'error.auth.invalid_signature') {
        // Redirect to invalid signature page
        window.location.href = '/invalid-signature';
        throw new Error('Invalid security token. Redirecting to login...');
      } else {
        // Generic 401 error
        window.location.href = '/session-expired';
        throw new Error('Authentication failed. Redirecting to login...');
      }
    }

    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      let errorMessage = 'Failed to create budget.';

      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

    throw error;
  }
};

// Login function
export const login = async (email: string, password: string): Promise<void> => {
  try {
    const response = await axios.post(`${API_GATEWAY_URL}/auth/login`, {
      email: email,
      password: password
    });

    // Store both token and expiration time
    localStorage.setItem('authToken', response.data.token);
    localStorage.setItem('tokenExpires', Date.now() + response.data.expiresIn);
  } catch (error) {
    console.error('Login failed:', error);

    // Extract and throw a more specific error message if available
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      let errorMessage = 'Invalid credentials. Please try again.';

      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

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

    // The API returns user data, but we don't need to store it
    // We just need to confirm registration was successful
    if (response.status === 200 || response.status === 201) {
      return; // Registration successful
    }
  } catch (error) {
    console.error('Registration failed:', error);

    // Extract and throw a more specific error message if available
    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      let errorMessage = 'Registration failed. Please try again.';

      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

    throw error;
  }
};

// Get current user function
export const getCurrentUser = async (): Promise<any> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_GATEWAY_URL}/users/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch user data:', error);

    // Check if it's a 401 error (session expired or invalid signature)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const errorData = error.response.data;
      
      // Check for specific error codes
      if (errorData?.errorCode === 'error.auth.token_expired') {
        // Redirect to session expired page
        window.location.href = '/session-expired';
        throw new Error('Session expired. Redirecting to login...');
      } else if (errorData?.errorCode === 'error.auth.invalid_signature') {
        // Redirect to invalid signature page
        window.location.href = '/invalid-signature';
        throw new Error('Invalid security token. Redirecting to login...');
      } else {
        // Generic 401 error
        window.location.href = '/session-expired';
        throw new Error('Authentication failed. Redirecting to login...');
      }
    }

    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      let errorMessage = 'Failed to fetch user data.';

      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

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
  localStorage.removeItem('tokenExpires');
};

// Check budget service health
export const checkBudgetServiceHealth = async (): Promise<string> => {
  try {
    const token = getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.get(`${API_GATEWAY_URL}/v1/api/budgets/greeting`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    return response.data;
  } catch (error) {
    console.error('Failed to check budget service health:', error);

    // Check if it's a 401 error (session expired or invalid signature)
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      const errorData = error.response.data;
      
      // Check for specific error codes
      if (errorData?.errorCode === 'error.auth.token_expired') {
        // Redirect to session expired page
        window.location.href = '/session-expired';
        throw new Error('Session expired. Redirecting to login...');
      } else if (errorData?.errorCode === 'error.auth.invalid_signature') {
        // Redirect to invalid signature page
        window.location.href = '/invalid-signature';
        throw new Error('Invalid security token. Redirecting to login...');
      } else {
        // Generic 401 error
        window.location.href = '/session-expired';
        throw new Error('Authentication failed. Redirecting to login...');
      }
    }

    if (axios.isAxiosError(error) && error.response) {
      const errorData = error.response.data;
      let errorMessage = 'Failed to connect to budget service.';

      if (errorData.detail) {
        errorMessage = errorData.detail;
      } else if (errorData.message) {
        errorMessage = errorData.message;
      }

      throw new Error(errorMessage);
    }

    throw error;
  }
};
