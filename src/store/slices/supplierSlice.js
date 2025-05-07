import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchSuppliers = createAsyncThunk(
  'suppliers/fetchSuppliers',
  async () => {
    const response = await api.get('/suppliers');
    return response.data;
  }
);

export const fetchSupplier = createAsyncThunk(
  'suppliers/fetchSupplier',
  async (id) => {
    const response = await api.get(`/suppliers/${id}`);
    return response.data;
  }
);

export const createSupplier = createAsyncThunk(
  'suppliers/createSupplier',
  async (supplierData) => {
    const response = await api.post('/suppliers', supplierData);
    return response.data;
  }
);

export const updateSupplier = createAsyncThunk(
  'suppliers/updateSupplier',
  async ({ id, data }) => {
    const response = await api.put(`/suppliers/${id}`, data);
    return response.data;
  }
);

export const deleteSupplier = createAsyncThunk(
  'suppliers/deleteSupplier',
  async (id) => {
    await api.delete(`/suppliers/${id}`);
    return id;
  }
);

const supplierSlice = createSlice({
  name: 'suppliers',
  initialState: {
    items: [],
    currentSupplier: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSuppliers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSuppliers.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSuppliers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSupplier.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSupplier.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSupplier = action.payload;
      })
      .addCase(fetchSupplier.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createSupplier.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateSupplier.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteSupplier.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default supplierSlice.reducer;