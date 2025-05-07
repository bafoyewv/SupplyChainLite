import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import orderReducer from './slices/orderSlice';
import inventoryReducer from './slices/inventorySlice';
import supplierReducer from './slices/supplierSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    orders: orderReducer,
    inventory: inventoryReducer,
    suppliers: supplierReducer,
    statistics: statisticsReducer
  }
});

export default store;