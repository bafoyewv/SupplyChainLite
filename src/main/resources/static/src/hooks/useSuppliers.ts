import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

interface Supplier {
  id: string;
  name: string;
  contactName: string;
  email: string;
  phone: string;
  status: string;
}

export const useSuppliers = (page = 0, size = 10) => {
  return useQuery({
    queryKey: ['suppliers', page, size],
    queryFn: async () => {
      const { data } = await apiClient.get(`/supply/get-all?page=${page}&size=${size}`);
      return data;
    },
  });
};

export const useCreateSupplier = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (supplier: Omit<Supplier, 'id'>) => {
      const { data } = await apiClient.post('/supply/add', supplier);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    },
  });
};