import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchOrders = createAsyncThunk(
  'orders/fetchOrders',
  async () => {
    const response = await api.get('/orders');
    return response.data;
  }
);

export const fetchOrder = createAsyncThunk(
  'orders/fetchOrder',
  async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  }
);

export const createOrder = createAsyncThunk(
  'orders/createOrder',
  async (orderData) => {
    const response = await api.post('/orders', orderData);
    return response.data;
  }
);

export const updateOrder = createAsyncThunk(
  'orders/updateOrder',
  async ({ id, data }) => {
    const response = await api.put(`/orders/${id}`, data);
    return response.data;
  }
);

export const deleteOrder = createAsyncThunk(
  'orders/deleteOrder',
  async (id) => {
    await api.delete(`/orders/${id}`);
    return id;
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    currentOrder: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.items.push(action.payload);
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.items = state.items.filter(item => item.id !== action.payload);
      });
  }
});

export default orderSlice.reducer;