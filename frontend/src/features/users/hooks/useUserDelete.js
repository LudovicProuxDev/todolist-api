import { useState } from 'react';
import { deleteUser } from '../api/userApi';

export const useUserDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const userDelete = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
        await deleteUser(id);
        return true;
    } catch (err) {
        console.error('Error API:', err);
        const errorDetail = err.response?.data?.detail || 'Error occured for deleting';
        setError(errorDetail);
        throw err;
    } finally {
        setIsLoading(false);
    }
  };

  return { userDelete, isLoading, error };
};