import { NavLink } from 'react-router';
import { useCategories } from '../hooks/useCategories';

const CategoriesList = () => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Erreur : {error.message || 'Une erreur est survenue'}</div>;

  return (
    <div>
      <h1>Categories</h1>
      <ul>
        {categories.map((item) => (
          <li key={item.id} style={{ backgroundColor: item.color }}>
            <NavLink to={`/categories/${item.id}`}>{item.label}</NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategoriesList;
