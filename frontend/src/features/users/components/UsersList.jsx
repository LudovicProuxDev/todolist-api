import { NavLink } from 'react-router';
import { useUsers } from '../hooks/useUsers';

const UsersList = () => {
  const { users, isLoading, error } = useUsers();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Users</h1>
      <div><NavLink to={"/users/create"}>Create User</NavLink></div>
      <ul>
        {users.map((item) => (
          <li key={item.id} style={{ backgroundColor: item.color }}>
            <NavLink to={`/users/${item.id}`}>{item.username} - {item.roles.join(' / ')}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UsersList;
