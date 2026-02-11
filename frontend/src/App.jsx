import { Routes, Route } from 'react-router';
import Home from './components/Home';
import CategoriesList from './features/categories/components/CategoriesList';
import CategoryItem from './features/categories/components/CategoryItem';
import TasksList from './features/tasks/components/TasksList';
import Layout from './components/Layout';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="tasks" element={<TasksList />} />
        <Route path="categories" element={<CategoriesList />} />
        <Route path="categories/:id" element={<CategoryItem />} />
      </Route>
    </Routes>
  );
}

export default App
