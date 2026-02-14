import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useTask } from '../hooks/useTask';
import { useTaskUpdate } from '../hooks/useTaskUpdate';
import { useCategories } from '../../categories/hooks/useCategories';

const TaskUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { task, isLoading: isLoadingGet, error: errorGet } = useTask(id);
  const { taskUpdate, isLoading, error } = useTaskUpdate();
  const { categories, isLoading: isLoadingCategory, error: errorCategory } = useCategories();

  const [formData, setFormData] = useState(task ?? {});

  useEffect(() => {
    setFormData(task);
  }, [task]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await taskUpdate(id, formData);
      navigate(`/tasks/${id}`);
    } catch (err) {
      console.error("Error update:", err);
    }
  };

  if (isLoadingGet) return <p>Loading...</p>;

  if (errorGet) return <div>Error : {errorGet.message || 'Error occured'}</div>;

  if (isLoadingCategory) return <p>Loading...</p>;

  if (errorCategory) return <div>Error : {errorCategory.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Task #{id}</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <p>Date: {task.createdAt}</p>
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

export default TaskUpdate;
