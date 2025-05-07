import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchStatistics = createAsyncThunk(
  'statistics/fetchStatistics',
  async () => {
    const response = await api.get('/statistics');
    return response.data;
  }
);

export const fetchSalesReport = createAsyncThunk(
  'statistics/fetchSalesReport',
  async ({ startDate, endDate }) => {
    const response = await api.get(`/statistics/sales?startDate=${startDate}&endDate=${endDate}`);
    return response.data;
  }
);

export const fetchInventoryReport = createAsyncThunk(
  'statistics/fetchInventoryReport',
  async () => {
    const response = await api.get('/statistics/inventory');
    return response.data;
  }
);

const statisticsSlice = createSlice({
  name: 'statistics',
  initialState: {
    overview: null,
    salesReport: null,
    inventoryReport: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchStatistics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStatistics.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchStatistics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchSalesReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.loading = false;
        state.salesReport = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchInventoryReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventoryReport.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryReport = action.payload;
      })
      .addCase(fetchInventoryReport.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  }
});

export default statisticsSlice.reducer;