import { useContext, useState } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = ({ target }) => {
        const { name, value } = target;
        setCredentials({ ...credentials, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!credentials.username) {
            setError('Field "username" is missing.');
            return;
        }
        if (!credentials.password) {
            setError('Field "password" is missing..');
            return;
        }

        const result = await login(credentials.username, credentials.password);

        if (result.success) {
            navigate('/');
        } else {
            setError(result.error || 'Invalid credentials.');
        }
    };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h2>Connection</h2>
        
        {error && <p>{error}</p>}

        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            name="username"
            autoComplete="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            autoComplete="current-password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>

        <button type="submit">
          Log in
        </button>
      </form>
    </div>
  );
};

export default Login;
