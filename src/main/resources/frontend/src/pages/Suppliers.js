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
import { getSuppliers, createSupplier, updateSupplier, deleteSupplier } from '../services/api';

const Suppliers = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      const response = await getSuppliers();
      setSuppliers(response.data);
    } catch (error) {
      console.error('Yetkazib beruvchilarni yuklashda xatolik:', error);
    }
  };

  const handleOpen = (supplier = null) => {
    if (supplier) {
      setSelectedSupplier(supplier);
      setFormData({
        name: supplier.name,
        contactPerson: supplier.contactPerson,
        email: supplier.email,
        phone: supplier.phone,
        address: supplier.address,
      });
    } else {
      setSelectedSupplier(null);
      setFormData({
        name: '',
        contactPerson: '',
        email: '',
        phone: '',
        address: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedSupplier(null);
    setFormData({
      name: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.id, formData);
      } else {
        await createSupplier(formData);
      }
      fetchSuppliers();
      handleClose();
    } catch (error) {
      console.error('Yetkazib beruvchini saqlashda xatolik:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteSupplier(id);
      fetchSuppliers();
    } catch (error) {
      console.error('Yetkazib beruvchini o\'chirishda xatolik:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'name', headerName: 'Nomi', width: 200 },
    { field: 'contactPerson', headerName: 'Aloqa shaxsi', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'phone', headerName: 'Telefon', width: 150 },
    { field: 'address', headerName: 'Manzil', width: 200 },
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
        <Typography variant="h4">Yetkazib beruvchilar</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Yangi yetkazib beruvchi
        </Button>
      </Box>

      <DataGrid
        rows={suppliers}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedSupplier ? 'Yetkazib beruvchini tahrirlash' : 'Yangi yetkazib beruvchi'}
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
            label="Aloqa shaxsi"
            fullWidth
            value={formData.contactPerson}
            onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Email"
            fullWidth
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Telefon"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Manzil"
            fullWidth
            multiline
            rows={2}
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
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

export default Suppliers; 