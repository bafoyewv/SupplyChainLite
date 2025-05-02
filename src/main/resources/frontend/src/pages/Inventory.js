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
import { getInventory, createInventory, updateInventory, deleteInventory } from '../services/api';
import { getProducts } from '../services/api';

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [formData, setFormData] = useState({
    productId: '',
    quantity: '',
    location: '',
    lastUpdated: '',
  });

  useEffect(() => {
    fetchInventory();
    fetchProducts();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await getInventory();
      setInventory(response.data);
    } catch (error) {
      console.error('Zaxiralarni yuklashda xatolik:', error);
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

  const handleOpen = (item = null) => {
    if (item) {
      setSelectedItem(item);
      setFormData({
        productId: item.productId,
        quantity: item.quantity,
        location: item.location,
        lastUpdated: item.lastUpdated,
      });
    } else {
      setSelectedItem(null);
      setFormData({
        productId: '',
        quantity: '',
        location: '',
        lastUpdated: new Date().toISOString().split('T')[0],
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedItem(null);
    setFormData({
      productId: '',
      quantity: '',
      location: '',
      lastUpdated: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedItem) {
        await updateInventory(selectedItem.id, formData);
      } else {
        await createInventory(formData);
      }
      fetchInventory();
      handleClose();
    } catch (error) {
      console.error('Zaxirani saqlashda xatolik:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteInventory(id);
      fetchInventory();
    } catch (error) {
      console.error('Zaxirani o\'chirishda xatolik:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
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
    { field: 'location', headerName: 'Joylashuvi', width: 150 },
    { field: 'lastUpdated', headerName: 'Yangilangan sana', width: 150 },
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
        <Typography variant="h4">Zaxiralar</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Yangi zaxira
        </Button>
      </Box>

      <DataGrid
        rows={inventory}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedItem ? 'Zaxirani tahrirlash' : 'Yangi zaxira'}
        </DialogTitle>
        <DialogContent>
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
            label="Joylashuvi"
            fullWidth
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          />

          <TextField
            margin="dense"
            label="Yangilangan sana"
            fullWidth
            type="date"
            value={formData.lastUpdated}
            onChange={(e) => setFormData({ ...formData, lastUpdated: e.target.value })}
            InputLabelProps={{
              shrink: true,
            }}
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

export default Inventory; 