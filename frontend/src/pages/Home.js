import React from 'react';
import { Box, Typography, Container } from '@mui/material';
import SearchBar from '../components/SearchBar';
import PopularLocations from '../components/PopularLocations';
import FeaturedCars from '../components/FeaturedCars';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const BANNER_IMAGE =
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80';

const Home = () => {
  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: '#f6f7fb' }}>
      <Navbar />
      {/* Banner section */}
      <Box
        sx={{
          width: '100%',
          minHeight: { xs: 320, md: 420 },
          backgroundImage: `url(${BANNER_IMAGE})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
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
        <Container sx={{ position: 'relative', zIndex: 2, textAlign: 'center' }}>
          <Typography
            variant="h3"
            fontWeight={700}
            color="#fff"
            sx={{ mb: 4, mt: { xs: 6, md: 0 } }}
          >
            Find Your Perfect Rental Car
          </Typography>
          <Box sx={{ mt: 10 }}>
            <SearchBar />
          </Box>
        </Container>
      </Box>

      {/* Popular Locations */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', width: '100%', mt: 8 }}>
        <PopularLocations />
      </Box>

      {/* Featured Cars */}
      <Box sx={{ maxWidth: '1400px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 } }}>
        <FeaturedCars />
      </Box>

      <Footer />
    </Box>
  );
};

export default Home; 