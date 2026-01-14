import axios from './axios';

export interface OrderNote {
  noteId: {
    _id: string;
    title: string;
    price: number;
    fileUrl: string;
    fileName: string;
  };
  price: number;
}

export interface Order {
  _id: string;
  userId: string;
  notes: OrderNote[];
  totalAmount: number;
  status: 'pending' | 'completed' | 'failed';
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
}

export interface AdminStats {
  totalUsers: number;
  totalNotes: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
  totalRevenue: number;
  totalContacts: number;
}

export const ordersAPI = {
  create: async (noteIds: string[]) => {
    const response = await axios.post('/orders/create', { noteIds });
    return response.data;
  },

  verify: async (data: {
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) => {
    const response = await axios.post('/orders/verify', data);
    return response.data;
  },

  getMyOrders: async () => {
    const response = await axios.get('/orders/my-orders');
    return response.data;
  },

  getAll: async () => {
    const response = await axios.get('/orders');
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axios.get(`/orders/${id}`);
    return response.data;
  },

  getAdminStats: async () => {
    const response = await axios.get('/orders/admin/stats');
    return response.data;
  },
};
