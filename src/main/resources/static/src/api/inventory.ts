
import api from './axios';
import { InventoryItem, InventoryResponse, InventoryCreateRequest } from '../types/inventory';

export const inventoryApi = {
  getInventory: async (page = 1, size = 10): Promise<InventoryResponse> => {
    const response = await api.get<InventoryResponse>('/inventory', {
      params: { page, size },
    });
    return response.data;
  },

  createInventoryItem: async (data: InventoryCreateRequest): Promise<InventoryItem> => {
    const response = await api.post<InventoryItem>('/inventory', data);
    return response.data;
  },

  updateInventoryItem: async (id: string, data: Partial<InventoryCreateRequest>): Promise<InventoryItem> => {
    const response = await api.put<InventoryItem>(`/inventory/${id}`, data);
    return response.data;
  },

  getInventoryItem: async (id: string): Promise<InventoryItem> => {
    const response = await api.get<InventoryItem>(`/inventory/${id}`);
    return response.data;
  },
};
