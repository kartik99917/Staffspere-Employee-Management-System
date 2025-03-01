import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request Headers:', config.headers); // Debug log
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    console.log('Login Response:', response.data); // Debug log
    
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      return response.data;
    } else {
      throw new Error('No token received from server');
    }
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

export const addEmployee = async (employeeData) => {
  try {
    const currentToken = localStorage.getItem('token');  // Get token here
    console.log('Token for employee add:', currentToken); // Debug log
    
    if (!currentToken) {
      throw new Error('No authentication token found');
    }
    
    const response = await api.post('/employees', employeeData);
    return response.data;
  } catch (error) {
    console.error('Add employee error:', error);
    throw error;
  }
};

export const getEmployees = async () => {
  try {
    const response = await api.get('/employees');
    return response.data;
  } catch (error) {
    console.error('Get employees error:', error);
    throw error;
  }
};

export default api; 