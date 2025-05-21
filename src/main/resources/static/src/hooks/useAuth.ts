import { useMutation } from '@tanstack/react-query';
import apiClient from '../lib/api-client';

interface LoginCredentials {
    username: string;
    password: string;
}

export const useLogin = () => {
    return useMutation({
        mutationFn: async (credentials: LoginCredentials) => {
            const { data } = await apiClient.post('/auth/login', credentials);
            return data;
        }
    });
};