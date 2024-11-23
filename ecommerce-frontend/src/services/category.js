import api from '../config/axios';

export const categoryService = {
  getAll: () => api.get('/category')
};