
// This is a simulated PostgreSQL service for the application
// In a real app, you would use a proper PostgreSQL client like 'pg' 

// Simulated database structure
interface DatabaseConnection {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  isConnected: boolean;
}

// Global connection object
let connection: DatabaseConnection | null = null;

// Initialize connection from stored config
export const initDatabaseConnection = () => {
  try {
    const storedConfig = localStorage.getItem('pgConfig');
    if (!storedConfig) {
      console.log('No stored database configuration found');
      return null;
    }

    const config = JSON.parse(storedConfig);
    connection = {
      ...config,
      isConnected: true
    };

    console.log('Database connection initialized:', connection);
    return connection;
  } catch (error) {
    console.error('Failed to initialize database connection:', error);
    return null;
  }
};

// Check if database is connected
export const isDatabaseConnected = (): boolean => {
  return connection !== null && connection.isConnected;
};

// Get connection details
export const getConnectionDetails = () => {
  if (!connection) {
    return null;
  }

  // Don't return password
  const { password, ...safeDetails } = connection;
  return safeDetails;
};

// Execute a mock query (for demonstration)
export const executeQuery = async (query: string, params: any[] = []): Promise<any> => {
  if (!connection) {
    throw new Error('Database is not connected');
  }

  console.log(`Executing query: ${query}`, params);
  
  // Simulate query execution delay
  await new Promise(resolve => setTimeout(resolve, 300));
  
  // Mock data responses based on query
  if (query.toLowerCase().includes('select * from products')) {
    return [
      { id: 1, name: 'Laptop', price: 1200, stock: 15, supplier_id: 1 },
      { id: 2, name: 'Smartphone', price: 800, stock: 25, supplier_id: 2 },
      { id: 3, name: 'Tablet', price: 450, stock: 10, supplier_id: 1 }
    ];
  }
  
  if (query.toLowerCase().includes('select * from suppliers')) {
    return [
      { id: 1, name: 'TechSupplies Inc.', contact: 'john@techsupplies.com', phone: '123-456-7890' },
      { id: 2, name: 'Electronics Hub', contact: 'sarah@electhub.com', phone: '987-654-3210' }
    ];
  }
  
  if (query.toLowerCase().includes('select * from orders')) {
    return [
      { id: 1, customer_name: 'Alice Brown', order_date: '2023-06-10', status: 'Delivered', total: 1200 },
      { id: 2, customer_name: 'Bob White', order_date: '2023-06-15', status: 'Processing', total: 450 },
      { id: 3, customer_name: 'Carol Davis', order_date: '2023-06-20', status: 'Pending', total: 800 }
    ];
  }
  
  // Default response for other queries
  return [];
};

// Disconnect from database
export const disconnectDatabase = () => {
  if (connection) {
    console.log('Disconnecting from database...');
    connection = null;
    localStorage.removeItem('pgConfig');
    return true;
  }
  return false;
};
