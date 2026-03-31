import { useState } from 'react';
import { createUser } from '../api/userApi';

export const useUserCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userCreate = async (userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createUser(userData);
      return response;
    } catch (err) {
      console.error('Error API:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { userCreate, isLoading, error };
};