import api from '../config/axios';

export const checkoutService = {
    postcheckoutService: (orderData) => api.post('/customer/orders', orderData)
  };