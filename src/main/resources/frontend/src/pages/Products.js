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
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { getProducts, createProduct, updateProduct, deleteProduct } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await getProducts();
      setProducts(response.data);
    } catch (error) {
      console.error('Mahsulotlarni yuklashda xatolik:', error);
    }
  };

  const handleOpen = (product = null) => {
    if (product) {
      setSelectedProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
      });
    } else {
      setSelectedProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedProduct(null);
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedProduct) {
        await updateProduct(selectedProduct.id, formData);
      } else {
        await createProduct(formData);
      }
      fetchProducts();
      handleClose();
    } catch (error) {
      console.error('Mahsulotni saqlashda xatolik:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (error) {
      console.error('Mahsulotni o\'chirishda xatolik:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nomi', width: 200 },
    { field: 'description', headerName: 'Tavsifi', width: 300 },
    { field: 'price', headerName: 'Narxi', width: 130 },
    { field: 'category', headerName: 'Kategoriya', width: 130 },
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
        <Typography variant="h4">Mahsulotlar</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Yangi mahsulot
        </Button>
      </Box>

      <DataGrid
        rows={products}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedProduct ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nomi"
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Tavsifi"
            fullWidth
            multiline
            rows={3}
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Narxi"
            fullWidth
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Kategoriya"
            fullWidth
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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

export default Products; 