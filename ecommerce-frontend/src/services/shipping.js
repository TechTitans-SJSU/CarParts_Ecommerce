import api from '../config/axios';

export const shippingService = {
    calculateShipping: (address) => api.post('/shipping/calculate', address),
    getShippingMethods: () => api.get('/shipping/methods')
  };