import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { fetchOrders, deleteOrder } from '../../store/slices/orderSlice';

const OrderList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: orders, loading, error } = useSelector(state => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Buyurtmani o\'chirishni tasdiqlaysizmi?')) {
      await dispatch(deleteOrder(id));
    }
  };

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Buyurtmalar ro'yxati</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/orders/new')}
        >
          Yangi buyurtma
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Buyurtma №</TableCell>
              <TableCell>Sana</TableCell>
              <TableCell>Mijoz</TableCell>
              <TableCell>Summa</TableCell>
              <TableCell>Holat</TableCell>
              <TableCell align="right">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>{order.orderNumber}</TableCell>
                <TableCell>{new Date(order.orderDate).toLocaleDateString()}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>{order.total.toLocaleString()} so'm</TableCell>
                <TableCell>
                  <Chip 
                    label={order.status === 'pending' ? 'Kutilmoqda' : 'Bajarildi'}
                    color={order.status === 'pending' ? 'warning' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/orders/edit/${order.id}`)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(order.id)} color="error">
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default OrderList;