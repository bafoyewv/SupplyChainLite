import axios from 'axios';
import { RegisterRequest } from '../types/auth';

const API_URL = '/api/v1/auth';

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await axios.post(`${API_URL}/register`, data);
    return response.data;
  },

  verify: async (data: { email: string; code: string }) => {
    const response = await axios.post(`${API_URL}/verify`, data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await axios.post(`${API_URL}/login`, data);
    return response.data;
  }
};
