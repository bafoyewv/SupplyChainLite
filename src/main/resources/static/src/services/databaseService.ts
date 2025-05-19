
import axios from 'axios';
import { toast } from 'sonner';

// Base API URL for database operations
const API_BASE_URL = '/api/v1';

// Helper function to handle API errors
const handleApiError = (error: any, customMessage: string = 'Operation failed') => {
  console.error('API Error:', error);
  
  let errorMessage = customMessage;
  if (error.response?.data?.message) {
    errorMessage = error.response.data.message;
  }
  
  toast.error(errorMessage);
  return Promise.reject(error);
};

// Generic database service for CRUD operations
export class DatabaseService<T> {
  endpoint: string;
  
  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }
  
  // Get all records
  async getAll(): Promise<T[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${this.endpoint}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Failed to fetch ${this.endpoint}`);
    }
  }
  
  // Get a record by ID
  async getById(id: number): Promise<T> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${this.endpoint}/${id}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Failed to fetch ${this.endpoint} with ID ${id}`);
    }
  }
  
  // Create a new record
  async create(data: Partial<T>): Promise<T> {
    try {
      const response = await axios.post(`${API_BASE_URL}/${this.endpoint}`, data);
      toast.success(`${this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1)} created successfully`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Failed to create ${this.endpoint}`);
    }
  }
  
  // Update an existing record
  async update(id: number, data: Partial<T>): Promise<T> {
    try {
      const response = await axios.put(`${API_BASE_URL}/${this.endpoint}/${id}`, data);
      toast.success(`${this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1)} updated successfully`);
      return response.data;
    } catch (error) {
      return handleApiError(error, `Failed to update ${this.endpoint}`);
    }
  }
  
  // Delete a record
  async delete(id: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/${this.endpoint}/${id}`);
      toast.success(`${this.endpoint.charAt(0).toUpperCase() + this.endpoint.slice(1)} deleted successfully`);
    } catch (error) {
      return handleApiError(error, `Failed to delete ${this.endpoint}`);
    }
  }
  
  // Custom query with parameters
  async query(queryPath: string, params?: Record<string, any>): Promise<any> {
    try {
      const response = await axios.get(`${API_BASE_URL}/${this.endpoint}/${queryPath}`, { params });
      return response.data;
    } catch (error) {
      return handleApiError(error, `Query failed for ${this.endpoint}`);
    }
  }
}

// Create service instances for each entity
export const productDatabase = new DatabaseService<any>('product');
export const inventoryDatabase = new DatabaseService<any>('inventory');
export const orderDatabase = new DatabaseService<any>('order');
export const supplierDatabase = new DatabaseService<any>('supplier');
export const userDatabase = new DatabaseService<any>('user');

// Function to initialize database connection
export const initializeDatabaseConnection = (databaseConfig: any) => {
  // This function would normally set up your database connection
  // For this example, we're just setting base URL for API calls
  axios.defaults.baseURL = databaseConfig.apiUrl || API_BASE_URL;
  
  console.log('Database connection initialized with config:', databaseConfig);
  return {
    isConnected: true,
    config: databaseConfig
  };
};

// Configuration helper for database connection
export const configureDatabaseConnection = (config: {
  apiUrl?: string;
  apiKey?: string;
  timeout?: number;
}) => {
  // Set default axios configuration
  if (config.apiUrl) {
    axios.defaults.baseURL = config.apiUrl;
  }
  
  if (config.apiKey) {
    axios.defaults.headers.common['X-API-Key'] = config.apiKey;
  }
  
  if (config.timeout) {
    axios.defaults.timeout = config.timeout;
  }
  
  return initializeDatabaseConnection(config);
};
