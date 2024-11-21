import api from '../config/axios';

export const categoryService = {
  getAll: () => api.get('/category'),
  getProductsByCategory: (categoryId) => api.get(`/products?category_id=${categoryId}`)
};