import axios from './axios';

export interface Board {
  _id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const boardsAPI = {
  getAll: async () => {
    const response = await axios.get('/boards');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`/boards/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description: string }) => {
    const response = await axios.post('/boards', data);
    return response.data;
  },

  update: async (id: string, data: { name: string; description: string }) => {
    const response = await axios.put(`/boards/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`/boards/${id}`);
    return response.data;
  },
};
