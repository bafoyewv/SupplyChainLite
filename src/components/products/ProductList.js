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
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { fetchProducts, deleteProduct } from '../../store/slices/productSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: products, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Mahsulotni o\'chirishni tasdiqlaysizmi?')) {
      await dispatch(deleteProduct(id));
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
        <Typography variant="h5">Mahsulotlar ro'yxati</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/products/new')}
        >
          Yangi mahsulot
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nomi</TableCell>
              <TableCell>Narxi</TableCell>
              <TableCell>Miqdori</TableCell>
              <TableCell>Ta'minotchi</TableCell>
              <TableCell align="right">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.price.toLocaleString()} so'm</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell>{product.supplier}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/products/edit/${product.id}`)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product.id)} color="error">
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

export default ProductList;