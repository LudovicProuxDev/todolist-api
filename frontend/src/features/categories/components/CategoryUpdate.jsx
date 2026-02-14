import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import { useCategoryUpdate } from '../hooks/useCategoryUpdate';
import { useCategory } from '../hooks/useCategory';

const CategoryUpdate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { category, isLoading: isLoadingGet, error: errorGet } = useCategory(id);
  const { categoryUpdate, isLoading, error } = useCategoryUpdate();

  const [formData, setFormData] = useState(category ?? {});

  useEffect(() => {
    setFormData(category);
  }, [category]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await categoryUpdate(id, formData);
      navigate(`/categories/${id}`);
    } catch (err) {
      console.error("Error update:", err);
    }
  };

  if (isLoadingGet) return <p>Loading...</p>;

  if (errorGet) return <div>Error : {errorGet.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Category #{id}</h1>
      
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
          {isLoading ? 'Update in progress...' : 'Update'}
        </button>
      </form>
    </div>
  );
};

export default CategoryUpdate;
