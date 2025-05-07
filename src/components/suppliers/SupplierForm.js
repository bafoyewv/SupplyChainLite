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
import { createSupplier, updateSupplier, fetchSupplier } from '../../store/slices/supplierSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Ta\'minotchi nomi kiritilishi shart'),
  contactPerson: Yup.string()
    .required('Kontakt shaxs kiritilishi shart'),
  phone: Yup.string()
    .required('Telefon raqam kiritilishi shart')
    .matches(/^\+?[0-9]{12}$/, 'Noto\'g\'ri telefon raqam formati'),
  email: Yup.string()
    .email('Noto\'g\'ri email format')
    .required('Email kiritilishi shart'),
  address: Yup.string()
    .required('Manzil kiritilishi shart')
});

const SupplierForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentSupplier, loading, error } = useSelector(state => state.suppliers);

  useEffect(() => {
    if (id) {
      dispatch(fetchSupplier(id));
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      name: '',
      contactPerson: '',
      phone: '',
      email: '',
      address: '',
      notes: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await dispatch(updateSupplier({ id, data: values })).unwrap();
        } else {
          await dispatch(createSupplier(values)).unwrap();
        }
        navigate('/suppliers');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  useEffect(() => {
    if (currentSupplier) {
      formik.setValues({
        name: currentSupplier.name,
        contactPerson: currentSupplier.contactPerson,
        phone: currentSupplier.phone,
        email: currentSupplier.email,
        address: currentSupplier.address,
        notes: currentSupplier.notes || ''
      });
    }
  }, [currentSupplier]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>
        {id ? 'Ta\'minotchini tahrirlash' : 'Yangi ta\'minotchi'}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="name"
              label="Ta'minotchi nomi"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="contactPerson"
              label="Kontakt shaxs"
              value={formik.values.contactPerson}
              onChange={formik.handleChange}
              error={formik.touched.contactPerson && Boolean(formik.errors.contactPerson)}
              helperText={formik.touched.contactPerson && formik.errors.contactPerson}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="phone"
              label="Telefon"
              value={formik.values.phone}
              onChange={formik.handleChange}
              error={formik.touched.phone && Boolean(formik.errors.phone)}
              helperText={formik.touched.phone && formik.errors.phone}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              name="address"
              label="Manzil"
              value={formik.values.address}
              onChange={formik.handleChange}
              error={formik.touched.address && Boolean(formik.errors.address)}
              helperText={formik.touched.address && formik.errors.address}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="notes"
              label="Qo'shimcha ma'lumot"
              value={formik.values.notes}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/suppliers')}>
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

export default SupplierForm;