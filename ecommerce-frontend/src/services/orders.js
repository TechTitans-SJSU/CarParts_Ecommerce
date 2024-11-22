import api from '../config/axios';

export const orderService = {
    create: (orderData) => api.post('/orders', orderData),
    getOrders: () => api.get('/orders'),
    getOrderById: (id) => api.get(`/orders/${id}`)
  };