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
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    email: '',
    fullName: '',
    role: '',
    phone: '',
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Foydalanuvchilarni yuklashda xatolik:', error);
    }
  };

  const handleOpen = (user = null) => {
    if (user) {
      setSelectedUser(user);
      setFormData({
        username: user.username,
        password: '',
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phone: user.phone,
      });
    } else {
      setSelectedUser(null);
      setFormData({
        username: '',
        password: '',
        email: '',
        fullName: '',
        role: 'USER',
        phone: '',
      });
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedUser(null);
    setFormData({
      username: '',
      password: '',
      email: '',
      fullName: '',
      role: '',
      phone: '',
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, formData);
      } else {
        await createUser(formData);
      }
      fetchUsers();
      handleClose();
    } catch (error) {
      console.error('Foydalanuvchini saqlashda xatolik:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      fetchUsers();
    } catch (error) {
      console.error('Foydalanuvchini o\'chirishda xatolik:', error);
    }
  };

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'username', headerName: 'Foydalanuvchi nomi', width: 150 },
    { field: 'email', headerName: 'Email', width: 200 },
    { field: 'fullName', headerName: 'To\'liq ismi', width: 200 },
    { field: 'role', headerName: 'Roli', width: 130 },
    { field: 'phone', headerName: 'Telefon', width: 150 },
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
        <Typography variant="h4">Foydalanuvchilar</Typography>
        <Button variant="contained" color="primary" onClick={() => handleOpen()}>
          Yangi foydalanuvchi
        </Button>
      </Box>

      <DataGrid
        rows={users}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        disableSelectionOnClick
      />

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {selectedUser ? 'Foydalanuvchini tahrirlash' : 'Yangi foydalanuvchi'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Foydalanuvchi nomi"
            fullWidth
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
          />
          <TextField
            margin="dense"
            label="Parol"
            fullWidth
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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
            label="To\'liq ismi"
            fullWidth
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Roli</InputLabel>
            <Select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <MenuItem value="ADMIN">Administrator</MenuItem>
              <MenuItem value="MANAGER">Menejer</MenuItem>
              <MenuItem value="USER">Foydalanuvchi</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            label="Telefon"
            fullWidth
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
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

export default Users; 