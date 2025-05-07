import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async () => {
    const response = await api.get('/inventory');
    return response.data;
  }
);

export const fetchInventoryItem = createAsyncThunk(
  'inventory/fetchInventoryItem',
  async (id) => {
    const response = await api.get(`/inventory/${id}`);
    return response.data;
  }
);

export const adjustInventory = createAsyncThunk(
  'inventory/adjustInventory',
  async ({ id, data }) => {
    const response = await api.put(`/inventory/${id}/adjust`, data);
    return response.data;
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    items: [],
    currentItem: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchInventoryItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryItem.fulfilled, (state, action) => {
        state.loading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchInventoryItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(adjustInventory.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      });
  }
});

export default inventorySlice.reducer;