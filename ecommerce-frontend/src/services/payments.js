import api from '../config/axios';

export const paymentService = {
    processPayment: (paymentData) => api.post('/payments/process', paymentData),
    getPaymentMethods: () => api.get('/payments/methods')
  };