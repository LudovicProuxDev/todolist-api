import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router';
import Home from './components/Home';
import CategoriesList from './features/categories/components/CategoriesList';
import TasksList from './features/tasks/components/TasksList';

export function App() {
  return (
    <Router>
      <nav>
        <ul>
          <li><NavLink to="/">Home</NavLink></li>
          <li><NavLink to="/tasks">Tasks</NavLink></li>
          <li><NavLink to="/categories">Categories</NavLink></li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/tasks" element={<TasksList />} />
        <Route path="/categories" element={<CategoriesList />} />
      </Routes>
    </Router>
  );
}

export default App
