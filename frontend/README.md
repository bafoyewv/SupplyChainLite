# Supply Chain Management Frontend

This is the frontend application for the Supply Chain Management system. It's built using React and provides a modern, responsive interface for managing products, suppliers, orders, and users.

## Features

- Dashboard with key statistics
- Product management (CRUD operations)
- Inventory tracking with low stock alerts
- Supplier management
- Order management with status tracking
- User management with role-based access

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- A running backend API server (default: http://localhost:8080)

## Setup

1. Clone the repository
2. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Start the development server:
   ```bash
   npm start
   ```

The application will be available at http://localhost:3000

## API Configuration

The application expects the backend API to be running at http://localhost:8080. If your API is running at a different URL, update the `API_BASE_URL` constant in `app.js`.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm build`: Builds the app for production
- `npm test`: Runs the test suite
- `npm eject`: Ejects from Create React App

## Project Structure

- `index.html`: Main HTML file
- `styles.css`: Global styles
- `app.js`: Main React application file containing all components
  - Dashboard
  - Products
  - Inventory
  - Suppliers
  - Orders
  - Users

## API Endpoints

The application expects the following API endpoints:

### Dashboard
- GET `/api/dashboard/stats`: Get dashboard statistics

### Products
- GET `/api/products`: Get all products
- POST `/api/products`: Create new product
- PUT `/api/products/:id`: Update product
- DELETE `/api/products/:id`: Delete product

### Inventory
- GET `/api/inventory/low-stock`: Get low stock products

### Suppliers
- GET `/api/suppliers`: Get all suppliers
- POST `/api/suppliers`: Create new supplier
- PUT `/api/suppliers/:id`: Update supplier
- DELETE `/api/suppliers/:id`: Delete supplier

### Orders
- GET `/api/orders`: Get all orders
- POST `/api/orders`: Create new order
- PUT `/api/orders/:id`: Update order
- DELETE `/api/orders/:id`: Delete order

### Users
- GET `/api/users`: Get all users
- POST `/api/users`: Create new user
- PUT `/api/users/:id`: Update user
- DELETE `/api/users/:id`: Delete user

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the MIT License. 