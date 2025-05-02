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
import { getOrderDetails, createOrderDetail, updateOrderDetail, deleteOrderDetail } from '../services/api';
import { getOrders } from '../services/api';
import { getProducts } from '../services/api';

const OrderDetails = () => {
  const [orderDetails, setOrderDetails] = useState([]);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [formData, setFormData] = useState({
    orderId: '',
    productId: '',
    quantity: '',
    unitPrice: '',
    totalPrice: '',
  });

  useEffect(() => {
    fetchOrderDetails();
    fetchOrders();
    fetchProducts();
  }, []);

  const fetchOrderDetails = async () => {
    try {
      const response = await getOrderDetails();
      setOrderDetails(response.data);
    } catch (error) {
      console.error('Buyurtma tafsilotlarini yuklashda xatolik:', error);
    }
  };

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

  const handleOpen = (detail = null) => {
    if (detail) {
      setSelectedDetail(detail);
      setFormData({
        orderId: detail.orderId,
        productId: detail.productId,
        quantity: detail.quantity,
        unitPrice: detail.unitPrice,
        totalPrice: detail.totalPrice,
      });
    } else {
      setSelectedDetail(null);
      setFormData({
        orderId: '',
        productId: '',
        quantity: '',
        unitPrice: '',
        totalPrice: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedDetail(null);
    setFormData({
      orderId: '',
      productId: '',
      quantity: '',
      unitPrice: '',
      totalPrice: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedDetail) {
        await updateOrderDetail(selectedDetail.id, formData);
      } else {
        await createOrderDetail(formData);
      }
      fetchOrderDetails();
      handleClose();
    } catch (error) {
      console.error('Buyurtma tafsilotini saqlashda xatolik:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteOrderDetail(id);
      fetchOrderDetails();
    } catch (error) {
      console.error('Buyurtma tafsilotini o\'chirishda xatolik:', error);
    }
  };

  const calculateTotalPrice = (quantity, unitPrice) => {
    return quantity * unitPrice;
  };

  const handleQuantityChange = (e) => {
    const quantity = parseFloat(e.target.value);
    const unitPrice = parseFloat(formData.unitPrice) || 0;
    setFormData({
      ...formData,
      quantity: quantity,
      totalPrice: calculateTotalPrice(quantity, unitPrice),
    });
  };

  const handleUnitPriceChange = (e) => {
    const unitPrice = parseFloat(e.target.value);
    const quantity = parseFloat(formData.quantity) || 0;
    setFormData({
      ...formData,
      unitPrice: unitPrice,
      totalPrice: calculateTotalPrice(quantity, unitPrice),
    });
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { 
      field: 'orderId', 
      headerName: 'Buyurtma', 
      width: 200,
      valueGetter: (params) => {
        const order = orders.find(o => o.id === params.row.orderId);
        return order ? `Buyurtma #${order.id}` : params.row.orderId;
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
    { field: 'unitPrice', headerName: 'Birlik narxi', width: 130 },
    { field: 'totalPrice', headerName: 'Umumiy narx', width: 130 },
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
        <Typography variant="h4">Buyurtma tafsilotlari</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Yangi buyurtma tafsiloti
        </Button>
      </Box>

      <DataGrid
        rows={orderDetails}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedDetail ? 'Buyurtma tafsilotini tahrirlash' : 'Yangi buyurtma tafsiloti'}
        </DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Buyurtma</InputLabel>
            <Select
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
            >
              {orders.map((order) => (
                <MenuItem key={order.id} value={order.id}>
                  Buyurtma #{order.id}
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
            onChange={handleQuantityChange}
          />

          <TextField
            margin="dense"
            label="Birlik narxi"
            fullWidth
            type="number"
            value={formData.unitPrice}
            onChange={handleUnitPriceChange}
          />

          <TextField
            margin="dense"
            label="Umumiy narx"
            fullWidth
            type="number"
            value={formData.totalPrice}
            disabled
          />
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

export default OrderDetails; 