import React, { useEffect } from 'react';
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
  Alert,
  CircularProgress
} from '@mui/material';
import { adjustInventory, fetchInventoryItem } from '../../store/slices/inventorySlice';

const validationSchema = Yup.object({
  quantity: Yup.number()
    .required('Miqdor kiritilishi shart')
    .min(0, 'Miqdor 0 dan katta bo\'lishi kerak'),
  minQuantity: Yup.number()
    .required('Minimal miqdor kiritilishi shart')
    .min(0, 'Minimal miqdor 0 dan katta bo\'lishi kerak'),
  reason: Yup.string()
    .required('Sabab kiritilishi shart')
});

const InventoryForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentItem, loading, error } = useSelector(state => state.inventory);

  useEffect(() => {
    if (id) {
      dispatch(fetchInventoryItem(id));
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      quantity: '',
      minQuantity: '',
      reason: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        await dispatch(adjustInventory({ id, data: values })).unwrap();
        navigate('/inventory');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  useEffect(() => {
    if (currentItem) {
      formik.setValues({
        quantity: currentItem.quantity,
        minQuantity: currentItem.minQuantity,
        reason: ''
      });
    }
  }, [currentItem]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>
        Inventar miqdorini o'zgartirish
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="quantity"
              label="Miqdori"
              type="number"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="minQuantity"
              label="Minimal miqdor"
              type="number"
              value={formik.values.minQuantity}
              onChange={formik.handleChange}
              error={formik.touched.minQuantity && Boolean(formik.errors.minQuantity)}
              helperText={formik.touched.minQuantity && formik.errors.minQuantity}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="reason"
              label="O'zgartirish sababi"
              value={formik.values.reason}
              onChange={formik.handleChange}
              error={formik.touched.reason && Boolean(formik.errors.reason)}
              helperText={formik.touched.reason && formik.errors.reason}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/inventory')}>
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

export default InventoryForm;