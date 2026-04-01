import { Routes, Route } from 'react-router';
import ProfileItem from '../components/ProfileItem';

const ProfileRoutes = () => {
  return (
    <Routes>
        <Route index element={<ProfileItem />} />
    </Routes>
  );
};

export default ProfileRoutes;