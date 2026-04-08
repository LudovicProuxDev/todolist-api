import { Routes, Route } from 'react-router';
import Home from './components/Home';
import Layout from './components/Layout';
import CategoryRoutes from './features/categories/routes/CategoryRoutes';
import TaskRoutes from './features/tasks/routes/TaskRoutes';
import UserRoutes from './features/users/routes/UserRoutes';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import Logout from './components/Logout';
import ProfileRoutes from './features/profile/routes/ProfileRoutes';
import { ROLES } from './constants/roles';
import Unauthorized from './components/Unauthorized';

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
        <Route path="tasks/*" element={<TaskRoutes />} />
        <Route path="categories/*" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
              <CategoryRoutes />
          </ProtectedRoute>
        }/>
        <Route path="users/*" element={
          <ProtectedRoute roles={[ROLES.ADMIN]}>
              <UserRoutes />
          </ProtectedRoute>
        }/>
        <Route path="profile/*" element={
          <ProtectedRoute>
              <ProfileRoutes />
          </ProtectedRoute>
        }/>
      </Route>
      <Route path="unauthorized" element={<Unauthorized />} />
    </Routes>
  );
}

export default App
