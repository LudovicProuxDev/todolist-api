import { useState, useEffect } from 'react';
import { getCategories } from '../api/categoryApi';

export const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCategories();
        setCategories(response.member);
      } catch (err) {
        console.error('Error API:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { categories, isLoading, error };
};
