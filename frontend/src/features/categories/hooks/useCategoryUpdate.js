import { useState } from 'react';
import { updateCategory } from '../api/categoryApi';

export const useCategoryUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryUpdate = async (id, categoryData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateCategory(id, categoryData);
      return response;
    } catch (err) {
      console.error('Error API:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { categoryUpdate, isLoading, error };
};