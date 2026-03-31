import { fetchData, postData, updateData, deleteData } from '@/api/api';
export const getUsers = () => fetchData('/users');
export const createUser = (user) => postData('/users', user);
export const getUser = (id) => fetchData(`/users/${id}`);
export const updateUser = (id, user) => updateData(`/users/${id}`, user);
export const deleteUser = (id, user) => deleteData(`/users/${id}`, user);