import axios from './axios';

export interface Note {
  _id: string;
  title: string;
  description: string;
  price: number;
  pages: number;
  board: string;
  boardId: string;
  stream: string;
  streamId: string;
  subject: string;
  subjectId: string;
  fileUrl: string;
  fileName: string;
  previewImage?: string;
  isPurchased?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const notesAPI = {
  getAll: async (params?: { boardId?: string; streamId?: string; subjectId?: string; search?: string }) => {
    const response = await axios.get('/notes', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`/notes/${id}`);
    return response.data;
  },

  create: async (formData: FormData) => {
    const response = await axios.post('/notes', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  update: async (id: string, formData: FormData) => {
    const response = await axios.put(`/notes/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axios.delete(`/notes/${id}`);
    return response.data;
  },

  download: async (id: string) => {
    const response = await axios.get(`/notes/${id}/download`, {
      responseType: 'blob',
    });
    return response.data;
  },
};
