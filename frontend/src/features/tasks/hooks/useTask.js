import { useState, useEffect } from 'react';
import { getTask } from '../api/taskApi';

export const useTask = (id) => {
  const [task, setTask] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTask(id);
        setTask(response);
      } catch (err) {
        console.error('Error API:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return { task, isLoading, error };
};
