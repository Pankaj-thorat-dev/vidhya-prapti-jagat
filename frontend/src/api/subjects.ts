import axios from './axios';

export interface Subject {
  _id: string;
  name: string;
  description: string;
  streamId: string;
  createdAt: string;
  updatedAt: string;
}

export const subjectsAPI = {
  getByStream: async (streamId: string) => {
    const response = await axios.get(`/subjects/stream/${streamId}`);
    return response.data;
  },

  create: async (data: { name: string; description: string; streamId: string }) => {
    const response = await axios.post('/subjects', data);
    return response.data;
  },

  update: async (id: string, data: { name: string; description: string; streamId: string }) => {
    const response = await axios.put(`/subjects/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`/subjects/${id}`);
    return response.data;
  },
};
