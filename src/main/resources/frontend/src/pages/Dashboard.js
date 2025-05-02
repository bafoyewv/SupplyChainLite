import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  Inventory as InventoryIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
} from '@mui/icons-material';
import { getOrders } from '../services/api';
import { getProducts } from '../services/api';
import { getUsers } from '../services/api';
import { getSuppliers } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalSuppliers: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [ordersResponse, productsResponse, usersResponse, suppliersResponse] = await Promise.all([
        getOrders(),
        getProducts(),
        getUsers(),
        getSuppliers(),
      ]);

      setStats({
        totalOrders: ordersResponse.data.length,
        totalProducts: productsResponse.data.length,
        totalUsers: usersResponse.data.length,
        totalSuppliers: suppliersResponse.data.length,
      });
    } catch (error) {
      console.error('Statistikani yuklashda xatolik:', error);
    }
  };

  const StatCard = ({ title, value, icon, color }) => (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" component="div" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Typography variant="h4" component="div">
          {value}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Boshqaruv paneli
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Buyurtmalar"
            value={stats.totalOrders}
            icon={<ShoppingCartIcon sx={{ color: 'primary.main', fontSize: 30 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mahsulotlar"
            value={stats.totalProducts}
            icon={<InventoryIcon sx={{ color: 'success.main', fontSize: 30 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Foydalanuvchilar"
            value={stats.totalUsers}
            icon={<PeopleIcon sx={{ color: 'info.main', fontSize: 30 }} />}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Yetkazib beruvchilar"
            value={stats.totalSuppliers}
            icon={<LocalShippingIcon sx={{ color: 'warning.main', fontSize: 30 }} />}
          />
        </Grid>
      </Grid>

      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Tizim haqida
        </Typography>
        <Typography variant="body1" paragraph>
          Supply Chain Management tizimi - bu mahsulotlar, buyurtmalar, zaxiralar va yetkazib beruvchilarni boshqarish uchun yaratilgan yagona platforma.
        </Typography>
        <Typography variant="body1" paragraph>
          Tizim orqali quyidagi amallarni bajarishingiz mumkin:
        </Typography>
        <ul>
          <li>Mahsulotlarni qo'shish, tahrirlash va o'chirish</li>
          <li>Buyurtmalarni yaratish va boshqarish</li>
          <li>Zaxiralarni kuzatish va boshqarish</li>
          <li>Yetkazib beruvchilar bilan ishlash</li>
          <li>Foydalanuvchilarni boshqarish</li>
        </ul>
      </Paper>
    </Box>
  );
};

export default Dashboard; 