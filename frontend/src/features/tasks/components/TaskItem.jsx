import { NavLink, useParams } from 'react-router';
import { useTask } from '../hooks/useTask';

const TaskItem = () => {
  const { id } = useParams();
  const { task, isLoading, error } = useTask(id);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Task #{id}</h1>
      <p>Description: {task.description}</p>
      <p>Date: {task.createdAt}</p>
      <p>Category: {task.category}</p>
      <div><NavLink to={`/tasks/${id}/update`}>Update</NavLink></div>
    </div>
  );
};

export default TaskItem;
