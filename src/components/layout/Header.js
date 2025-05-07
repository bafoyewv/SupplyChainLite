import React from 'react';
import { useDispatch } from 'react-redux';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Box
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../store/slices/authSlice';

const Header = ({ open, setOpen }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          onClick={() => setOpen(!open)}
          edge="start"
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
          Supply Chain Management
        </Typography>
        <Box>
          <Button color="inherit" onClick={handleLogout}>
            Chiqish
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;