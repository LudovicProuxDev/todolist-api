import axios from 'axios';

const API_BASE_URL = '/api';

// Instance Axios configurée
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    // Ajoute d'autres headers si nécessaire (ex: Authorization)
  },
});

// Exemple de fonction pour récupérer des données
export const fetchData = async (endpoint) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des données:', error);
    throw error;
  }
};

// Exemple de fonction pour envoyer des données
export const postData = async (endpoint, data) => {
  try {
    const response = await api.post(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de l\'envoi des données:', error);
    throw error;
  }
};

// Exemple de fonction pour mettre à jour des données
export const updateData = async (endpoint, data) => {
  try {
    const response = await api.patch(endpoint, data);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour des données:', error);
    throw error;
  }
};

// Exemple de fonction pour supprimer des données
export const deleteData = async (endpoint) => {
  try {
    const response = await api.delete(endpoint);
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la suppression des données:', error);
    throw error;
  }
};

export default api;
