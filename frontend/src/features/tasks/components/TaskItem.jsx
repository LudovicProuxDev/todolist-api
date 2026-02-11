import { useParams } from 'react-router';
import { useTask } from '../hooks/useTask';

const TaskItem = () => {
  const { id } = useParams();
  const { task, isLoading, error } = useTask(id);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Erreur : {error.message || 'Une erreur est survenue'}</div>;

  return (
    <div>
      <h1>Task #{id}</h1>
      <p>Description: {task.description}</p>
      <p>Date: {task.createdAt}</p>
      <p>Category: {task.category}</p>
    </div>
  );
};

export default TaskItem;
