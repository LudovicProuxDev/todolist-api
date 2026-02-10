import { fetchData, postData, updateData, deleteData } from '@/api/api';
export const getCategories = () => fetchData('/categories');
export const createCategory = (task) => postData('/categories', task);
export const getCategory = () => fetchData(`/categories/${id}`);
export const updateCategory = (id, task) => updateData(`/categories/${id}`, task);
export const deleteCategory = (id, task) => deleteData(`/categories/${id}`, task);