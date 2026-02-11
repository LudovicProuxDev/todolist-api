import { Routes, Route } from 'react-router';
import TasksList from '../components/TasksList';
import TaskItem from '../components/TaskItem';

const TaskRoutes = () => {
  return (
    <Routes>
        <Route index element={<TasksList />} />
        <Route path=":id" element={<TaskItem />} />
    </Routes>
  );
};

export default TaskRoutes;