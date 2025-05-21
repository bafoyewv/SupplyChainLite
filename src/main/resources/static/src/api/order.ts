import api from './axios';
import { Order, OrderResponse, OrderCreateRequest } from '../types/order';

export const orderApi = {
  getOrders: async (page = 1, size = 10): Promise<OrderResponse> => {
    const response = await api.get<OrderResponse>('/order', {
      params: { page, size },
    });
    return response.data;
  },

  createOrder: async (data: OrderCreateRequest): Promise<Order> => {
    const response = await api.post<Order>('/order', data);
    return response.data;
  },

  getOrder: async (id: string): Promise<Order> => {
    const response = await api.get<Order>(`/order/${id}`);
    return response.data;
  },
};
