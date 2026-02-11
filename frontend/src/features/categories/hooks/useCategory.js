import { useState, useEffect } from 'react';
import { getCategory } from '../api/categoryApi';

export const useCategory = (id) => {
  const [category, setCategory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getCategory(id);
        setCategory(response);
      } catch (err) {
        console.error('Erreur API:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { category, isLoading, error };
};
