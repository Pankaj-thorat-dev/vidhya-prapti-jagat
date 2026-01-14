import axios from 'axios';

const API_URL = 'http://localhost:5000/api/contact';

export interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const contactAPI = {
  // Submit contact form (public)
  submit: (data: ContactFormData) => {
    return axios.post(API_URL, data);
  },

  // Get all contact messages (admin only)
  getAll: () => {
    const token = localStorage.getItem('token');
    return axios.get<{ success: boolean; count: number; data: ContactMessage[] }>(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  // Delete contact message (admin only)
  delete: (id: string) => {
    const token = localStorage.getItem('token');
    return axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};
