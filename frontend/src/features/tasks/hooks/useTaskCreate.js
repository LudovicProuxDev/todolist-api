import { useState } from 'react';
import { createTask } from '../api/taskApi';

export const useTaskCreate = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const taskCreate = async (taskData) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await createTask(taskData);
      return response;
    } catch (err) {
      console.error('Error API:', err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  };

  return { taskCreate, isLoading, error };
};