import React from 'react';
import { Box, Container } from '@mui/material';
import Navbar from '../components/Navbar';
import Profile from '../components/Profile';
import Footer from '../components/Footer';

const ProfilePage = () => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <Navbar />
      <Container 
        component="main" 
        maxWidth={false}
        sx={{ 
          flex: 1,
          py: 4,
          px: { xs: 1, md: 4 },
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Profile />
      </Container>
      <Footer />
    </Box>
  );
};

export default ProfilePage; 