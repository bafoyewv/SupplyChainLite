import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/layout/Layout';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/products/ProductList';
import ProductForm from './components/products/ProductForm';
import OrderList from './components/orders/OrderList';
import OrderForm from './components/orders/OrderForm';
import InventoryList from './components/inventory/InventoryList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route index element={<ProductList />} />
            <Route path="products">
              <Route index element={<ProductList />} />
              <Route path="new" element={<ProductForm />} />
              <Route path="edit/:id" element={<ProductForm />} />
            </Route>
            <Route path="orders">
              <Route index element={<OrderList />} />
              <Route path="new" element={<OrderForm />} />
              <Route path="edit/:id" element={<OrderForm />} />
            </Route>
            <Route path="inventory" element={<InventoryList />} />
          </Route>
        </Routes>
      </Router>
      <ToastContainer />
    </ThemeProvider>
  );
}

export default App;