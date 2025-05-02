import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../services/api';
import { getProducts } from '../services/api';
import { getUsers } from '../services/api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [formData, setFormData] = useState({
    userId: '',
    productId: '',
    quantity: '',
    orderDate: '',
    status: '',
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await getOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Buyurtmalarni yuklashda xatolik:', error);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Mahsulotlarni yuklashda xatolik:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Foydalanuvchilarni yuklashda xatolik:', error);
    }
  };

  const handleOpen = (order = null) => {
    if (order) {
      setSelectedOrder(order);
      setFormData({
        userId: order.userId,
        productId: order.productId,
        quantity: order.quantity,
        orderDate: order.orderDate,
        status: order.status,
      });
    } else {
      setSelectedOrder(null);
      setFormData({
        userId: '',
        productId: '',
        quantity: '',
        orderDate: new Date().toISOString().split('T')[0],
        status: 'PENDING',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedOrder(null);
    setFormData({
      userId: '',
      productId: '',
      quantity: '',
      orderDate: '',
      status: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedOrder) {
        await updateOrder(selectedOrder.id, formData);
      } else {
        await createOrder(formData);
      }
      fetchOrders();
      handleClose();
    } catch (error) {
      console.error('Buyurtmani saqlashda xatolik:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrder(id);
      fetchOrders();
    } catch (error) {
      console.error('Buyurtmani o\'chirishda xatolik:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { 
      field: 'userId', 
      headerName: 'Foydalanuvchi', 
      width: 200,
      valueGetter: (params) => {
        const user = users.find(u => u.id === params.row.userId);
        return user ? user.name : params.row.userId;
      }
    },
    { 
      field: 'productId', 
      headerName: 'Mahsulot', 
      width: 200,
      valueGetter: (params) => {
        const product = products.find(p => p.id === params.row.productId);
        return product ? product.name : params.row.productId;
      }
    },
    { field: 'quantity', headerName: 'Miqdor', width: 130 },
    { field: 'orderDate', headerName: 'Buyurtma sanasi', width: 150 },
    { field: 'status', headerName: 'Holati', width: 130 },
    {
      field: 'actions',
      headerName: 'Amallar',
      width: 200,
      renderCell: (params) => (
        <Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => handleOpen(params.row)}
            sx={{ mr: 1 }}
          >
            Tahrirlash
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id)}
          >
            O'chirish
          </Button>
        </Box>
      ),
    },
  ];

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h4">Buyurtmalar</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Yangi buyurtma
        </Button>
      </Box>

      <DataGrid
        rows={orders}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedOrder ? 'Buyurtmani tahrirlash' : 'Yangi buyurtma'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Foydalanuvchi</InputLabel>
            <Select
              value={formData.userId}
              onChange={(e) => setFormData({ ...formData, userId: e.target.value })}
            >
              {users.map((user) => (
                <MenuItem key={user.id} value={user.id}>
                  {user.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Mahsulot</InputLabel>
            <Select
              value={formData.productId}
              onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            >
              {products.map((product) => (
                <MenuItem key={product.id} value={product.id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            margin="dense"
            label="Miqdor"
            fullWidth
            type="number"
            value={formData.quantity}
            onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Buyurtma sanasi"
            fullWidth
            type="date"
            value={formData.orderDate}
            onChange={(e) => setFormData({ ...formData, orderDate: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Holati</InputLabel>
            <Select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            >
              <MenuItem value="PENDING">Kutilmoqda</MenuItem>
              <MenuItem value="PROCESSING">Jarayonda</MenuItem>
              <MenuItem value="COMPLETED">Tugallangan</MenuItem>
              <MenuItem value="CANCELLED">Bekor qilingan</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Bekor qilish</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Saqlash
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Orders; 