import { useState } from 'react';
import { createCategory } from '../api/categoryApi';

export const useCategoryCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryCreate = async (categoryData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createCategory(categoryData);
      return response;
    } catch (err) {
      console.error('Error API:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { categoryCreate, isLoading, error };
};