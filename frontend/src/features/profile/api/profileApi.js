import { fetchData } from '@/api/api';
export const getProfile = () => fetchData('/me');