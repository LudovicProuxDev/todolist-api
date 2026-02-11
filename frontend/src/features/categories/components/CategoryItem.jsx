import { NavLink, useNavigate, useParams } from 'react-router';
import { useCategory } from '../hooks/useCategory';
import { useCategoryDelete } from '../hooks/useCategoryDelete';

const CategoryItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { category, isLoading, error } = useCategory(id);
  const { categoryDelete, isLoading: isDeleting, error: deleteError } = useCategoryDelete();

  const handleDelete = async () => {
    if (window.confirm('Confirm the removal of this category?')) {
      try {
        await categoryDelete(id);
        navigate('/categories');
      } catch (err) {
        console.error("Error delete:", err);
      }
    }
  };

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Category #{id}</h1>
      
      {deleteError && (
        <div style={{ color: 'red', border: '1px solid red', padding: '10px', marginBottom: '10px' }}>
          {deleteError}
        </div>
      )}

      <p>Label: {category.label}</p>
      <p>Color: {category.color} - <span style={{ border: 'solid 1px black', backgroundColor: category.color, width: '100px', height: '20px', display: 'inline-block' }}></span></p>
      <div>
        <NavLink to={`/categories/${id}/update`}>Update</NavLink>
        <button onClick={() => handleDelete()} disabled={isDeleting} >{isDeleting ? 'Deletion...' : 'Delete'}</button>
      </div>
    </div>
  );
};

export default CategoryItem;
