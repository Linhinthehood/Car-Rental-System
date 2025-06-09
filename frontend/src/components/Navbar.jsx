import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Avatar, Menu, MenuItem, IconButton } from '@mui/material';
import { Link as RouterLink, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  // Giả lập lấy user từ localStorage (sau này sẽ lấy từ API)
  const token = localStorage.getItem('token');
  let user = null;
  if (token) {
    // Tạm thời hardcode, sau này lấy từ API hoặc decode token
    user = {
      name: 'Vip88',
      avatar: 'https://cdn-icons-png.flaticon.com/512/747/747376.png',
    };
  }

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
              <IconButton onClick={handleMenu} sx={{ p: 0, mr: 1 }}>
                <Avatar src={user.avatar} alt={user.name} />
              </IconButton>
              <Typography variant="body1" sx={{ fontWeight: 600, display: 'inline', mr: 2 }}>
                {user.name}
              </Typography>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              >
                <MenuItem component={RouterLink} to="/my-rentals" onClick={handleClose}>My Rentals</MenuItem>
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