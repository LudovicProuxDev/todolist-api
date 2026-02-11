import { useState } from 'react';
import { deleteCategory } from '../api/categoryApi';

export const useCategoryDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const categoryDelete = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await deleteCategory(id);
        return true;
    } catch (err) {
        console.error('Error API:', err);
        setError(err);
    } finally {
        setIsLoading(false);
    }
  };

  return { categoryDelete, isLoading, error };
};