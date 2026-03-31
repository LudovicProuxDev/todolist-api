import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useUser } from '../hooks/useUser';
import { useUserUpdate } from '../hooks/useUserUpdate';

const UserUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isLoading: isLoadingGet, error: errorGet } = useUser(id);
  const { userUpdate, isLoading, error } = useUserUpdate();

  const [formData, setFormData] = useState(user ?? {});

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    const currentRoles = formData.roles || [];
    
    if (checked) {
      setFormData(prev => ({ ...prev, roles: [...currentRoles, value] }));
    } else {
      setFormData(prev => ({
        ...prev,
        roles: currentRoles.filter(role => role !== value)
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await userUpdate(id, formData);
      navigate(`/users/${id}`);
    } catch (err) {
      console.error("Error update:", err);
    }
  };

  if (isLoadingGet) return <p>Loading...</p>;

  if (errorGet) return <div>Error : {errorGet.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>User #{id}</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Lastname:</label>
          <input
            type="text"
            name="lastname"
            value={formData.lastname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Firstname:</label>
          <input
            type="text"
            name="firstname"
            value={formData.firstname}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Roles:</label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '10px' }}>
            {['ROLE_ADMIN'].map(role => (
              <label key={role} style={{ cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  value={role}
                  checked={formData.roles?.includes(role) || false}
                  onChange={handleCheckboxChange}
                />
                {role.replace('ROLE_', '')}
              </label>
            ))}
          </div>
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px', cursor: 'pointer' }}>
          {isLoading ? 'Creation in progress...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default UserUpdate;
