import api from '../config/axios';

export const productService = {
    getAll: () => api.get('/products'),
    getById: (id) => api.get(`/products/${id}`),
    getByCategory: (id) => api.get(`/products/category/${id}`)
  };