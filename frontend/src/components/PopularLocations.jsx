import React from 'react';
import { Box, Typography, Card, CardMedia, CardContent, Chip } from '@mui/material';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const LOCATIONS = [
  {
    name: 'Ho Chi Minh City',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: "Vietnam's largest city with diverse vehicle options",
    cars: 3,
  },
  {
    name: 'Ha Noi',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    description: 'The capital city with extensive car rental services',
    cars: 2,
  },
  {
    name: 'Da Nang',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Coastal city with modern rental fleet',
    cars: 0,
  },
  {
    name: 'Hai Phong',
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80',
    description: 'Major port city in northern Vietnam',
    cars: 1,
  },
  {
    name: 'Can Tho',
    image: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?auto=format&fit=crop&w=800&q=80',
    description: 'The heart of the Mekong Delta',
    cars: 2,
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
              <Card sx={{ borderRadius: 4, boxShadow: 3, position: 'relative', height: 320, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', overflow: 'visible', mb: 4 }}>
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
                  }}
                >
                  <Chip
                    label={`${loc.cars} cars available`}
                    color={loc.cars > 0 ? 'primary' : 'default'}
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