import { NavLink } from 'react-router';
import { useCategories } from '../hooks/useCategories';

const CategoriesList = () => {
  const { categories, isLoading, error } = useCategories();

  if (isLoading) return <p>Loading...</p>;

  if (error) return <div>Error : {error.message || 'Error occured'}</div>;

  return (
    <div>
      <h1>Categories</h1>
      <div><NavLink to={"/categories/create"}>Create Category</NavLink></div>
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
