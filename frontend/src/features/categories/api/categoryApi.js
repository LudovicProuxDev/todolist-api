import { fetchData, postData, updateData, deleteData } from '@/api/api';
export const getCategories = () => fetchData('/categories');
export const createCategory = (category) => postData('/categories', category);
export const getCategory = (id) => fetchData(`/categories/${id}`);
export const updateCategory = (id, category) => updateData(`/categories/${id}`, category);
export const deleteCategory = (id, category) => deleteData(`/categories/${id}`, category);