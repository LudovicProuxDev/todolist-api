import { fetchData, postData, updateData, deleteData } from '@/api/api';
export const getTasks = () => fetchData('/categories');
export const createTask = (task) => postData('/categories', task);
export const getTask = () => fetchData(`/categories/${id}`);
export const updateTask = (id, task) => updateData(`/categories/${id}`, task);
export const deleteTask = (id, task) => deleteData(`/categories/${id}`, task);