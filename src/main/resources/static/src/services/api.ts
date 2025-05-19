
import axios from 'axios';
import { toast } from 'sonner';
import { configureDatabaseConnection } from './databaseService';

// Configure the database connection
export const initializeBackendServices = (config = {}) => {
  const dbConnection = configureDatabaseConnection({
    apiUrl: '/api/v1',
    ...config
  });
  
  console.log('Backend services initialized:', dbConnection);
  return dbConnection;
};

// Base API instance
const api = axios.create({
  baseURL: '/api/v1', // Your API base URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response) {
      // Handle specific status codes
      if (response.status === 401) {
        toast.error('Session expired. Please log in again.');
        // Redirect to login or handle token expiration
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      } else if (response.status === 403) {
        toast.error('You do not have permission to perform this action');
      } else if (response.status === 500) {
        toast.error('Server error. Please try again later.');
      } else {
        toast.error(response.data?.message || 'Something went wrong');
      }
    } else {
      toast.error('Network error. Please check your connection.');
    }
    
    return Promise.reject(error);
  }
);

// Auth services
export const authService = {
  login: (email: string, password: string) => api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) => 
    api.post('/auth/register', { username, email, password }),
};

// Product services
export const productService = {
  getAll: () => api.get('/product'),
  getById: (id: number) => api.get(`/product/${id}`),
  create: (product: any) => api.post('/product', product),
  update: (id: number, product: any) => api.put(`/product/${id}`, product),
  delete: (id: number) => api.delete(`/product/${id}`),
  search: (name: string) => api.get(`/product/search/${name}`),
  getLowStock: () => api.get('/product/get-low-stock-products'),
  getBySupplier: (supplierId: number) => api.get(`/product/get-products-by-supplier/${supplierId}`),
};

// Inventory services
export const inventoryService = {
  getAll: () => api.get('/inventory'),
  getById: (id: number) => api.get(`/inventory/${id}`),
  create: (inventory: any) => api.post('/inventory', inventory),
  update: (id: number, inventory: any) => api.put(`/inventory/${id}`, inventory),
  delete: (id: number) => api.delete(`/inventory/${id}`),
  getAlerts: () => api.get('/inventory/alerts'),
  getMovementHistory: (inventoryId: number) => api.get(`/inventory/movement-history/${inventoryId}`),
  updateQuantity: (id: number, quantity: number) => 
    api.put(`/inventory/update-quantity/${id}`, { quantity }),
};

// Order services
export const orderService = {
  getAll: () => api.get('/order'),
  getById: (id: number) => api.get(`/order/${id}`),
  create: (order: any) => api.post('/order', order),
  update: (id: number, order: any) => api.put(`/order/${id}`, order),
  delete: (id: number) => api.delete(`/order/${id}`),
  getByStatus: (status: string) => api.get(`/order/get-orders-by-status/${status}`),
  getByDateRange: (startDate: string, endDate: string) => 
    api.get(`/order/get-orders-by-date-range/${startDate}/${endDate}`),
};

// Order details services
export const orderDetailsService = {
  getAll: () => api.get('/order-details'),
  getById: (id: number) => api.get(`/order-details/${id}`),
  create: (orderDetails: any) => api.post('/order-details', orderDetails),
  update: (id: number, orderDetails: any) => api.put(`/order-details/${id}`, orderDetails),
  delete: (id: number) => api.delete(`/order-details/${id}`),
};

// Supplier services
export const supplierService = {
  getAll: () => api.get('/supply/get-all'),
  getById: (id: number) => api.get(`/supply/get-by-id/${id}`),
  create: (supplier: any) => api.post('/supply/add', supplier),
  update: (id: number, supplier: any) => api.put(`/supply/update/${id}`, supplier),
  delete: (id: number) => api.delete(`/supply/delete/${id}`),
};

// User services
export const userService = {
  getProfile: () => api.get('/user/profile'),
  updateProfile: (user: any) => api.put('/user/update', user),
  getAll: () => api.get('/user'), // Admin only
  getById: (id: number) => api.get(`/user/${id}`), // Admin only
  delete: (id: number) => api.delete(`/user/${id}`), // Admin only
};

export default api;
