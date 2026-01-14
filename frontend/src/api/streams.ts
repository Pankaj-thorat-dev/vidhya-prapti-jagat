import axios from './axios';

export interface Stream {
  _id: string;
  name: string;
  description: string;
  boardId: string;
  createdAt: string;
  updatedAt: string;
}

export const streamsAPI = {
  getByBoard: async (boardId: string) => {
    const response = await axios.get(`/streams/board/${boardId}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`/streams/${id}`);
    return response.data;
  },

  create: async (data: { name: string; description: string; boardId: string }) => {
    const response = await axios.post('/streams', data);
    return response.data;
  },

  update: async (id: string, data: { name: string; description: string; boardId: string }) => {
    const response = await axios.put(`/streams/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`/streams/${id}`);
    return response.data;
  },
};
