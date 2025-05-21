import apiClient from '../lib/api-client';
import { RegisterRequest } from '../types/auth';

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await apiClient.post('/auth/register', data);
    return response.data;
  },

  verify: async (data: { email: string; code: string }) => {
    const response = await apiClient.post('/auth/verify', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await apiClient.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await apiClient.get('/user/profile');
    return response.data;
  }
};
