import { Routes, Route } from 'react-router';
import Home from './components/Home';
import Layout from './components/Layout';
import CategoryRoutes from './features/categories/routes/CategoryRoutes';
import TaskRoutes from './features/tasks/routes/TaskRoutes';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tasks/*" element={<TaskRoutes />} />
        <Route path="categories/*" element={<CategoryRoutes />} />
      </Route>
    </Routes>
  );
}

export default App
