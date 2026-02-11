import { useState, useEffect } from 'react';
import { getTasks } from '../api/taskApi';

export const useTasks = () => {
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await getTasks();
        setTasks(response.member);
      } catch (err) {
        console.error('Error API:', err);
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { tasks, isLoading, error };
};
