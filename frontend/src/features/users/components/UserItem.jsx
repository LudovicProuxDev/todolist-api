import { NavLink, useNavigate, useParams } from 'react-router';
import { useUser } from '../hooks/useUser';
import { useUserDelete } from '../hooks/useUserDelete';

const UserItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading, error } = useUser(id);
  const { userDelete, isLoading: isDeleting, error: deleteError } = useUserDelete();

  const handleDelete = async () => {
    if (window.confirm('Confirm the removal of this user?')) {
      try {
        await userDelete(id);
        navigate('/users');
      } catch (err) {
        console.error("Error delete:", err);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>User #{id}</h1>
      
      {deleteError && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>
          {deleteError}
        </div>
      )}

      <p>Username: {user.username}</p>
      <p>Fistname: {user.firstname}</p>
      <p>Lastname: {user.lastname}</p>
      <div>
        <NavLink to={`/users/${id}/update`}>Update</NavLink>
        <button onClick={() => handleDelete()} disabled={isDeleting} >{isDeleting ? 'Deletion...' : 'Delete'}</button>
      </div>
    </div>
  );
};

export default UserItem;
