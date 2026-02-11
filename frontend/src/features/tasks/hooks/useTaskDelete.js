import { useState } from 'react';
import { deleteTask } from '../api/taskApi';

export const useTaskDelete = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const taskDelete = async (id) => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await deleteTask(id);
        return true;
    } catch (err) {
        console.error('Error API:', err);
        setError(err);
    } finally {
        setIsLoading(false);
    }
  };

  return { taskDelete, isLoading, error };
};