import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useCategoryCreate } from '../hooks/useCategoryCreate';

const CategoryCreate = () => {
  const navigate = useNavigate();
  const { categoryCreate, isLoading, error } = useCategoryCreate();

  const [formData, setFormData] = useState({
    label: '',
    color: '#000000'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoryCreate(formData);
      navigate('/categories');
    } catch (err) {
      console.error("Error creation:", err);
    }
  };

  return (
    <div>
      <h1>Create Category</h1>
      
      {error && <p style={{ color: 'red' }}>{error}</p>}
      
      <form onSubmit={handleSubmit}>
        <div>
          <label>Label:</label>
          <input
            type="text"
            name="label"
            value={formData.label}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Color:</label>
          <input
            type="color"
            name="color"
            value={formData.color}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={isLoading} style={{ padding: '10px', cursor: 'pointer' }}>
          {isLoading ? 'Creation in progress...' : 'Save'}
        </button>
      </form>
    </div>
  );
};

export default CategoryCreate;
