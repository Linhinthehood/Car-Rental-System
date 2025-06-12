import React from 'react';
import { Box, Typography } from '@mui/material';

const AuthBanner = ({ image, title, description, position = 'left' }) => {
  return (
    <Box
      sx={{
        flex: 1,
        display: { xs: 'none', md: 'flex' },
        alignItems: 'flex-end',
        justifyContent: 'center',
        backgroundImage: `url(${image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        order: position === 'right' ? 2 : 0,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), rgba(0,0,0,0.3))',
          top: 0,
          left: 0,
          zIndex: 1,
        }}
      />
      <Box 
        sx={{ 
          position: 'relative', 
          zIndex: 2, 
          color: '#fff', 
          p: 6, 
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end'
        }}
      >
        <Typography 
          variant="h3" 
          fontWeight={700} 
          gutterBottom
          sx={{ mb: 1 }}
        >
          Premium Car Rental
        </Typography>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 400
          }}
        >
          Experience the luxury of premium cars with our simple login process.
        </Typography>
      </Box>
    </Box>
  );
};

export default AuthBanner; 