import React, { useState, useEffect } from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import api from '../utils/axios';

const LOCATIONS = [
  {
    name: 'Ho Chi Minh City',
    image: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=800&q=80',
    description: "Vietnam's largest city with diverse vehicle options",
    coordinates: [10.7756, 106.7004],
    city: 'Ho Chi Minh city'
  },
  {
    name: 'Ha Noi',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    description: 'The capital city with extensive car rental services',
    coordinates: [21.0285, 105.8542],
    city: 'Ha Noi city'
  },
  {
    name: 'Da Nang',
    image: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=800&q=80',
    description: 'Coastal city with modern rental fleet',
    coordinates: [16.0544, 108.2022],
    city: 'Da Nang city'
  },
  {
    name: 'Nha Trang',
    image: 'https://images.unsplash.com/photo-1599571234909-29ed5d1321d6?auto=format&fit=crop&w=800&q=80',
    description: 'Famous coastal city with quality rental services',
    coordinates: [12.2388, 109.1967],
    city: 'Nha Trang city'
  },
  {
    name: 'Quy Nhon',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=800&q=80',
    description: 'Beautiful coastal city with growing rental services',
    coordinates: [13.7765, 109.2233],
    city: 'Quy Nhon city'
  },
];

const settings = {
  dots: true,
  infinite: true,
  speed: 500,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 3000,
  responsive: [
    {
      breakpoint: 960,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 600,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const PopularLocations = () => {
  const [locationStats, setLocationStats] = useState({});

  useEffect(() => {
    const fetchVehicleCounts = async () => {
      try {
        const response = await api.get('/api/vehicles/available', {
          params: {
            limit: 1000 // Set a large limit to get all vehicles
          }
        });
        const vehicles = response.data.data || [];
        
        // Count vehicles by city
        const counts = vehicles.reduce((acc, vehicle) => {
          const city = vehicle.location?.city;
          if (city) {
            acc[city] = (acc[city] || 0) + 1;
          }
          return acc;
        }, {});

        setLocationStats(counts);
      } catch (error) {
        console.error('Error fetching vehicle counts:', error);
      }
    };

    fetchVehicleCounts();
  }, []);

  return (
    <Box sx={{ my: 8 }}>
      <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
        Popular Locations
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Choose from our most popular rental locations
      </Typography>
      <Box sx={{ maxWidth: 1300, mx: 'auto', pb: 6, overflow: 'visible', position: 'relative' }}>
        <Slider {...settings}>
          {LOCATIONS.map((loc) => (
            <Box key={loc.name} px={2}>
              <Card sx={{ 
                borderRadius: 4, 
                boxShadow: 3, 
                position: 'relative', 
                height: 320, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'flex-start', 
                overflow: 'visible', 
                mb: 4,
                transition: 'transform 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-8px)',
                }
              }}>
                <CardMedia
                  component="img"
                  height="160"
                  image={loc.image}
                  alt={loc.name}
                  sx={{
                    objectFit: 'cover',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    backgroundColor: '#f5f5f5',
                  }}                  
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" fontWeight={700} gutterBottom>
                    {loc.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {loc.description}
                  </Typography>
                </CardContent>
                <Box
                  sx={{
                    position: 'absolute',
                    left: 16,
                    bottom: 16,
                    display: 'flex',
                    gap: 1,
                  }}
                >
                  <Chip
                    label={`${locationStats[loc.city] || 0} cars available`}
                    color={(locationStats[loc.city] || 0) > 0 ? 'primary' : 'default'}
                    sx={{ fontWeight: 600, fontSize: 16, height: 32 }}
                  />
                </Box>
              </Card>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default PopularLocations; 