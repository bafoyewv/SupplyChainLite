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
  MenuItem,
  Alert
} from '@mui/material';
import { createProduct, updateProduct, fetchProduct } from '../../store/slices/productSlice';

const validationSchema = Yup.object({
  name: Yup.string()
    .required('Mahsulot nomi kiritilishi shart'),
  price: Yup.number()
    .required('Narx kiritilishi shart')
    .min(0, 'Narx 0 dan katta bo\'lishi kerak'),
  quantity: Yup.number()
    .required('Miqdor kiritilishi shart')
    .min(0, 'Miqdor 0 dan katta bo\'lishi kerak'),
  supplier: Yup.string()
    .required('Ta\'minotchi tanlanishi shart')
});

const ProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { currentProduct, loading, error } = useSelector(state => state.products);

  useEffect(() => {
    if (id) {
      dispatch(fetchProduct(id));
    }
  }, [dispatch, id]);

  const formik = useFormik({
    initialValues: {
      name: '',
      price: '',
      quantity: '',
      supplier: '',
      description: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      try {
        if (id) {
          await dispatch(updateProduct({ id, data: values })).unwrap();
        } else {
          await dispatch(createProduct(values)).unwrap();
        }
        navigate('/products');
      } catch (error) {
        console.error('Error:', error);
      }
    }
  });

  useEffect(() => {
    if (currentProduct) {
      formik.setValues({
        name: currentProduct.name,
        price: currentProduct.price,
        quantity: currentProduct.quantity,
        supplier: currentProduct.supplier,
        description: currentProduct.description || ''
      });
    }
  }, [currentProduct]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" mb={3}>
        {id ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
      </Typography>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Box component="form" onSubmit={formik.handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="name"
              label="Mahsulot nomi"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              name="price"
              label="Narxi"
              type="number"
              value={formik.values.price}
              onChange={formik.handleChange}
              error={formik.touched.price && Boolean(formik.errors.price)}
              helperText={formik.touched.price && formik.errors.price}
            />
          </Grid>
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
              select
              name="supplier"
              label="Ta'minotchi"
              value={formik.values.supplier}
              onChange={formik.handleChange}
              error={formik.touched.supplier && Boolean(formik.errors.supplier)}
              helperText={formik.touched.supplier && formik.errors.supplier}
            >
              <MenuItem value="supplier1">Ta'minotchi 1</MenuItem>
              <MenuItem value="supplier2">Ta'minotchi 2</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              name="description"
              label="Tavsif"
              value={formik.values.description}
              onChange={formik.handleChange}
            />
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
              <Button onClick={() => navigate('/products')}>
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

export default ProductForm;