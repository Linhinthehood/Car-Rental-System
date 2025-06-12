import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import api from '../utils/axios';

const Navbar = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [user, setUser] = useState(null);
  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const res = await api.get('/api/users/me');
        setUser(res.data.data || res.data); // tuỳ backend trả về
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  return (
    <AppBar position="static" color="inherit" elevation={1} sx={{ zIndex: 10 }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Typography
            variant="h6"
            component={RouterLink}
            to="/"
            sx={{
              color: 'primary.main',
              fontWeight: 700,
              textDecoration: 'none',
              mr: 4,
              fontSize: 24,
            }}
          >
            Car Rental
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Button
              component={RouterLink}
              to="/"
              color={location.pathname === '/' ? 'primary' : 'inherit'}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Home
            </Button>
            <Button
              component={RouterLink}
              to="/vehicles"
              color={location.pathname.startsWith('/vehicles') ? 'primary' : 'inherit'}
              sx={{ textTransform: 'none', fontWeight: 500 }}
            >
              Cars
            </Button>
            {(user && (user.role === 'customer' || user.role === 'car_provider')) && (
              <Button
                component={RouterLink}
                to="/my-rentals"
                color={location.pathname.startsWith('/my-rentals') ? 'primary' : 'inherit'}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                My Rental
              </Button>
            )}
            {(user && user.role === 'car_provider') && (
              <Button
                component={RouterLink}
                to="/manager-cars"
                color={location.pathname.startsWith('/manager-cars') ? 'primary' : 'inherit'}
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Manager Cars
              </Button>
            )}
          </Box>
        </Box>
        <Box>
          {!user ? (
            <>
              <Button
                component={RouterLink}
                to="/login"
                color="inherit"
                sx={{ textTransform: 'none', fontWeight: 500, mr: 1 }}
              >
                Sign in
              </Button>
              <Button
                component={RouterLink}
                to="/register"
                variant="contained"
                color="primary"
                sx={{ textTransform: 'none', fontWeight: 500 }}
              >
                Sign up
              </Button>
            </>
          ) : (
            <>
              <Typography variant="body1" sx={{ fontWeight: 600, display: 'inline', mr: 1 }}>
                {user.name}
              </Typography>
              <IconButton onClick={handleMenu} sx={{ p: 0, mr: 1 }}>
                <Avatar src={user.avatar} alt={user.name} />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem component={RouterLink} to="/profile" onClick={handleClose}>My Profile</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar; 