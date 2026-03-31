import { Routes, Route } from 'react-router';
import UsersList from '../components/UsersList';
import UserCreate from '../components/UserCreate';
import UserItem from '../components/UserItem';
import UserUpdate from '../components/UserUpdate';

const UserRoutes = () => {
  return (
    <Routes>
        <Route index element={<UsersList />} />
        <Route path="/create" element={<UserCreate />} />
        <Route path=":id" element={<UserItem />} />
        <Route path=":id/update" element={<UserUpdate />} />
    </Routes>
  );
};

export default UserRoutes;