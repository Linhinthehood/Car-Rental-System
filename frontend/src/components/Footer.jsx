import React from 'react';
import { Box, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box sx={{
      width: '100%',
      py: 2,
      px: 1,
      mt: 'auto',
      backgroundColor: '#f5f5f5',
      textAlign: 'center',
      borderTop: '1px solid #e0e0e0',
    }}>
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} Car Rental. All rights reserved. | Contact: <Link href="mailto:support@carrental.com">support@carrental.com</Link>
      </Typography>
    </Box>
  );
};

export default Footer; 