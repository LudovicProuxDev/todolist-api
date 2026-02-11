import { Routes, Route } from 'react-router';
import TasksList from '../components/TasksList';
import TaskItem from '../components/TaskItem';
import TaskCreate from '../components/TaskCreate';
import TaskUpdate from '../components/TaskUpdate';

const TaskRoutes = () => {
  return (
    <Routes>
        <Route index element={<TasksList />} />
        <Route path="/create" element={<TaskCreate />} />
        <Route path=":id" element={<TaskItem />} />
        <Route path=":id/update" element={<TaskUpdate />} />
    </Routes>
  );
};

export default TaskRoutes;