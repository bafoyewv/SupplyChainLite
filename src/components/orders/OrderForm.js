import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  MenuItem,
  Alert
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { createOrder, updateOrder, fetchOrder } from '../../store/slices/orderSlice';

const validationSchema = Yup.object({
  customer: Yup.string()
    .required('Mijoz nomi kiritilishi shart'),
  items: Yup.array()
    .of(
      Yup.object({
        productId: Yup.string()
          .required('Mahsulot tanlanishi shart'),
        quantity: Yup.number()
          .required('Miqdor kiritilishi shart')
          .min(1, 'Miqdor 1 dan katta bo\'lishi kerak')
      })
    )
    .min(1, 'Kamida bitta mahsulot qo\'shilishi kerak')
});

const OrderForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentOrder, loading, error } = useSelector(state => state.orders);
  const { items: products } = useSelector(state => state.products);

  const formik = useFormik({
    initialValues: {
      customer: '',
      orderDate: new Date().toISOString().split('T')[0],
      items: [],
      notes: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await dispatch(updateOrder({ id, data: values })).unwrap();
        } else {
          await dispatch(createOrder(values)).unwrap();
        }
        navigate('/orders');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchOrder(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (currentOrder) {
      formik.setValues({
        customer: currentOrder.customer,
        orderDate: currentOrder.orderDate,
        items: currentOrder.items,
        notes: currentOrder.notes || ''
      });
    }
  }, [currentOrder]);

  const handleAddItem = () => {
    formik.setFieldValue('items', [
      ...formik.values.items,
      { productId: '', quantity: 1, price: 0 }
    ]);
  };

  const handleRemoveItem = (index) => {
    const items = [...formik.values.items];
    items.splice(index, 1);
    formik.setFieldValue('items', items);
  };

  const handleItemChange = (index, field, value) => {
    const items = [...formik.values.items];
    items[index][field] = value;
    
    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        items[index].price = product.price;
      }
    }
    
    formik.setFieldValue('items', items);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>
        {id ? 'Buyurtmani tahrirlash' : 'Yangi buyurtma'}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="customer"
              label="Mijoz"
              value={formik.values.customer}
              onChange={formik.handleChange}
              error={formik.touched.customer && Boolean(formik.errors.customer)}
              helperText={formik.touched.customer && formik.errors.customer}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="date"
              name="orderDate"
              label="Sana"
              value={formik.values.orderDate}
              onChange={formik.handleChange}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle1">Mahsulotlar</Typography>
              <Button startIcon={<Add />} onClick={handleAddItem}>
                Mahsulot qo'shish
              </Button>
            </Box>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Mahsulot</TableCell>
                    <TableCell>Miqdori</TableCell>
                    <TableCell>Narxi</TableCell>
                    <TableCell>Jami</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {formik.values.items.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>
                        <TextField
                          select
                          fullWidth
                          value={item.productId}
                          onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
                          error={formik.touched.items?.[index]?.productId && 
                                Boolean(formik.errors.items?.[index]?.productId)}
                          helperText={formik.touched.items?.[index]?.productId && 
                                    formik.errors.items?.[index]?.productId}
                        >
                          {products.map((product) => (
                            <MenuItem key={product.id} value={product.id}>
                              {product.name}
                            </MenuItem>
                          ))}
                        </TextField>
                      </TableCell>
                      <TableCell>
                        <TextField
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                          error={formik.touched.items?.[index]?.quantity && 
                                Boolean(formik.errors.items?.[index]?.quantity)}
                          helperText={formik.touched.items?.[index]?.quantity && 
                                    formik.errors.items?.[index]?.quantity}
                        />
                      </TableCell>
                      <TableCell>{item.price?.toLocaleString()} so'm</TableCell>
                      <TableCell>{(item.price * item.quantity)?.toLocaleString()} so'm</TableCell>
                      <TableCell>
                        <IconButton color="error" onClick={() => handleRemoveItem(index)}>
                          <Delete />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="notes"
              label="Izohlar"
              value={formik.values.notes}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/orders')}>
                Bekor qilish
              </Button>
              <Button type="submit" variant="contained">
                Saqlash
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Paper>
  );
};

export default OrderForm;