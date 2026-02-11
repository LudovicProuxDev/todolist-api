import { NavLink } from 'react-router';
import { useTasks } from "../hooks/useTasks";

const TasksList = () => {
  const { tasks, isLoading, error } = useTasks();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Tasks</h1>
      <div><NavLink to={"/tasks/create"}>Create Task</NavLink></div>
      <ul>
        {tasks.map((item) => (
          <li key={item.id}>
            <NavLink to={`/tasks/${item.id}`}>#{item.id}</NavLink> / {item.description} - <strong>Date:</strong> {item.createdAt}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TasksList;
