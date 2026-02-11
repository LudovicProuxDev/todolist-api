import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useTaskCreate } from '../hooks/useTaskCreate';
import { useCategories } from '../../categories/hooks/useCategories';

const TaskCreate = () => {
  const navigate = useNavigate();
  const { categories, isLoading: isLoadingCategory, error: errorCategory } = useCategories();
  const { taskCreate, isLoading, error } = useTaskCreate();

  const [formData, setFormData] = useState({
    description: '',
    category: '',
    createdAt: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const allData = {
        ...formData,
        createdAt: new Date().toISOString(),
      };
      await taskCreate(allData);
      navigate('/tasks');
    } catch (err) {
      console.error("Error creation:", err);
    }
  };

  if (isLoadingCategory) return <p>Loading...</p>;

  if (errorCategory) return <div>Erreur : {errorCategory.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Create Task</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Description:</label>
          <textarea
            type="text"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <select name="category" value={formData.category} onChange={handleChange} required>
            <option value="">Select a Category</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat['@id']}>
                {cat.label}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px', cursor: 'pointer' }}>
          {isLoading ? 'Creation in progress...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default TaskCreate;
