import { useState, useEffect } from 'react';
import { getUser } from '../api/userApi';

export const useUser = (id) => {
  const [user, setUser] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getUser(id);
        setUser(response);
      } catch (err) {
        console.error('Error API:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { user, isLoading, error };
};
