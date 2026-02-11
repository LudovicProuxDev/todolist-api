import { NavLink, useNavigate, useParams } from 'react-router';
import { useTask } from '../hooks/useTask';
import { useTaskDelete } from '../hooks/useTaskDelete';

const TaskItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, isLoading, error } = useTask(id);
  const { taskDelete, isLoading: isDeleting, error: deleteError } = useTaskDelete();
  
  const handleDelete = async () => {
    if (window.confirm('Confirm the removal of this task?')) {
      try {
        await taskDelete(id);
        navigate('/tasks');
      } catch (err) {
        console.error("Error delete:", err);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Task #{id}</h1>

      {deleteError && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>
          {deleteError}
        </div>
      )}

      <p>Description: {task.description}</p>
      <p>Date: {task.createdAt}</p>
      <p>Category: {task.category}</p>
      <div>
        <NavLink to={`/tasks/${id}/update`}>Update</NavLink>
        <button onClick={() => handleDelete()} disabled={isDeleting} >{isDeleting ? 'Deletion...' : 'Delete'}</button>
      </div>
    </div>
  );
};

export default TaskItem;
