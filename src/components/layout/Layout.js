import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const [open, setOpen] = useState(true);

  return (
    <Box sx={{ display: 'flex' }}>
      <Header open={open} setOpen={setOpen} />
      <Sidebar open={open} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
          ml: open ? '240px' : '73px',
          transition: 'margin 0.2s'
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;