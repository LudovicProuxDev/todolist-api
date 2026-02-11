import { Routes, Route } from 'react-router';
import CategoriesList from '../components/CategoriesList';
import CategoryItem from '../components/CategoryItem';
import CategoryCreate from '../components/CategoryCreate';

const CategoryRoutes = () => {
  return (
    <Routes>
        <Route index element={<CategoriesList />} />
        <Route path="/create" element={<CategoryCreate />} />
        <Route path=":id" element={<CategoryItem />} />
    </Routes>
  );
};

export default CategoryRoutes;