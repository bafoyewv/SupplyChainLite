import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async () => {
    const response = await api.get('/products');
    return response.data;
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id) => {
    const response = await api.get(`/products/${id}`);
    return response.data;
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData) => {
    const response = await api.post('/products', productData);
    return response.data;
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data }) => {
    const response = await api.put(`/products/${id}`, data);
    return response.data;
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id) => {
    await api.delete(`/products/${id}`);
    return id;
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default productSlice.reducer;