import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Chip,
  CircularProgress,
  Alert
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { fetchInventory } from '../../store/slices/inventorySlice';

const InventoryList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: inventory, loading, error } = useSelector(state => state.inventory);

  useEffect(() => {
    dispatch(fetchInventory());
  }, [dispatch]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Box>
      <Typography variant="h5" mb={3}>
        Inventar nazorati
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mahsulot</TableCell>
              <TableCell>Miqdori</TableCell>
              <TableCell>Minimal miqdor</TableCell>
              <TableCell>Holat</TableCell>
              <TableCell align="right">Amallar</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {inventory.map((item) => (
              <TableRow key={item.id}>
                <TableCell>{item.productName}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>{item.minQuantity}</TableCell>
                <TableCell>
                  <Chip 
                    label={item.quantity <= item.minQuantity ? 'Kam qoldi' : 'Yetarli'}
                    color={item.quantity <= item.minQuantity ? 'error' : 'success'}
                    size="small"
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => navigate(`/inventory/adjust/${item.id}`)} color="primary">
                    <Edit />
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

export default InventoryList;