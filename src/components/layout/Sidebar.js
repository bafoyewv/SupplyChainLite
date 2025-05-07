import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Toolbar
} from '@mui/material';
import {
  Inventory,
  ShoppingCart,
  Assignment,
  People
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Sidebar = ({ open }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const drawerWidth = 240;

  const menuItems = [
    { text: 'Mahsulotlar', icon: <Inventory />, path: '/products' },
    { text: 'Buyurtmalar', icon: <ShoppingCart />, path: '/orders' },
    { text: 'Inventar', icon: <Assignment />, path: '/inventory' },
    { text: "Ta'minotchilar", icon: <People />, path: '/suppliers' }
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: open ? drawerWidth : 73,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: open ? drawerWidth : 73,
          transition: 'width 0.2s',
          overflowX: 'hidden'
        },
      }}
    >
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
              selected={location.pathname.startsWith(item.path)}
              sx={{
                minHeight: 48,
                justifyContent: open ? 'initial' : 'center',
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ opacity: open ? 1 : 0 }}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;