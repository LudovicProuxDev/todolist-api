import { useState } from 'react';
import { updateUser } from '../api/userApi';

export const useUserUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userUpdate = async (id, userData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateUser(id, userData);
      return response;
    } catch (err) {
      console.error('Error API:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { userUpdate, isLoading, error };
};