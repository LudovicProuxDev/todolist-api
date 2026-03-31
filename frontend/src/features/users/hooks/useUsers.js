import { useState, useEffect } from 'react';
import { getUsers } from '../api/userApi';

export const useUsers = () => {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getUsers();
        setUsers(response.member);
      } catch (err) {
        console.error('Error API:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, isLoading, error };
};
