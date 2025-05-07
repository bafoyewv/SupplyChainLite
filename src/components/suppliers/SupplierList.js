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
import { fetchSuppliers, deleteSupplier } from '../../store/slices/supplierSlice';

const SupplierList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: suppliers, loading, error } = useSelector(state => state.suppliers);

  useEffect(() => {
    dispatch(fetchSuppliers());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm('Ta\'minotchini o\'chirishni tasdiqlaysizmi?')) {
      await dispatch(deleteSupplier(id));
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
        <Typography variant="h5">Ta'minotchilar ro'yxati</Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={() => navigate('/suppliers/new')}
        >
          Yangi ta'minotchi
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nomi</TableCell>
              <TableCell>Kontakt shaxs</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Manzil</TableCell>
              <TableCell align="right">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell>{supplier.name}</TableCell>
                <TableCell>{supplier.contactPerson}</TableCell>
                <TableCell>{supplier.phone}</TableCell>
                <TableCell>{supplier.email}</TableCell>
                <TableCell>{supplier.address}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/suppliers/edit/${supplier.id}`)} color="primary">
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(supplier.id)} color="error">
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

export default SupplierList;