import api from '../config/axios';

export const partService = {
    getByProduct: (id) => api.get(`/parts/product/${id}`)
  };