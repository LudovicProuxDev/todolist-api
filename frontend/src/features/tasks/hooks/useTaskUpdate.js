import { useState } from 'react';
import { updateTask } from '../api/taskApi';

export const useTaskUpdate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const taskUpdate = async (id, taskData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await updateTask(id, taskData);
      return response;
    } catch (err) {
      console.error('Error API:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { taskUpdate, isLoading, error };
};