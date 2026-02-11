import { useParams } from 'react-router';
import { useCategory } from '../hooks/useCategory';

const CategoryItem = () => {
  const { id } = useParams();
  const { category, isLoading, error } = useCategory(id);

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Erreur : {error.message || 'Une erreur est survenue'}</div>;

  return (
    <div>
      <h1>Category #{id}</h1>
      <p>Label: {category.label}</p>
      <p>Color: {category.color} - <span style={{ border: 'solid 1px black', backgroundColor: category.color, width: '100px', height: '20px', display: 'inline-block' }}></span></p>
    </div>
  );
};

export default CategoryItem;
