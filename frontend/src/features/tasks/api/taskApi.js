import { fetchData, postData, updateData, deleteData } from '@/api/api';
export const getTasks = () => fetchData('/tasks');
export const createTask = (task) => postData('/tasks', task);
export const getTask = (id) => fetchData(`/tasks/${id}`);
export const updateTask = (id, task) => updateData(`/tasks/${id}`, task);
export const deleteTask = (id, task) => deleteData(`/tasks/${id}`, task);