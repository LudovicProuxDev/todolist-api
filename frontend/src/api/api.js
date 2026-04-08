import axios from 'axios';

const API_BASE_URL = '/api';

// Instance Axios with API
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/ld+json',
    'Accept': 'application/ld+json',
  },
  withCredentials: true
});

// Intercept each response
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            console.warn("Session expired or not valid");
        }
        return Promise.reject(error);
    }
);

// Function to get data
export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error for getting data:', error);
    throw error;
  }
};

// Function to send data
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Error for sending data:', error);
    throw error;
  }
};

// Function to update data
export const updateData = async (endpoint, data) => {
  try {
    const response = await api.patch(endpoint, data, {
      headers: {
      'Content-Type': 'application/merge-patch+json',
    },
    });
    return response.data;
  } catch (error) {
    console.error('Error for updating data:', error);
    throw error;
  }
};

// Function to delete data
export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Error for deleting data:', error);
    throw error;
  }
};

export default api;
