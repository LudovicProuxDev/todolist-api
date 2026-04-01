import { useParams } from 'react-router';
import { useProfile } from '../hooks/useProfile';

const ProfileItem = () => {
  const { id } = useParams();
  const { profile, isLoading, error } = useProfile(id);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>My profile</h1>

      <p>Username: {profile.username}</p>
      <p>Fistname: {profile.firstname}</p>
      <p>Lastname: {profile.lastname}</p>
      <p>Email: {profile.email}</p>
      <p>Roles: {profile.roles?.join(" / ")}</p>
    </div>
  );
};

export default ProfileItem;
