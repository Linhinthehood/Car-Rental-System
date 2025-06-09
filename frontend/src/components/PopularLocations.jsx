import React from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip } from '@mui/material';

const LOCATIONS = [
  {
    name: 'Ho Chi Minh City',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80',
    description: "Vietnam's largest city with diverse vehicle options",
    cars: 3,
  },
  {
    name: 'Ha Noi',
    image: 'https://images.unsplash.com/photo-1467301540037-ff0dc0fd8bdf?auto=format&fit=crop&w=800&q=80',
    description: 'The capital city with extensive car rental services',
    cars: 2,
  },
  {
    name: 'Da Nang',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    description: 'Coastal city with modern rental fleet',
    cars: 0,
  },
];

const PopularLocations = () => {
  return (
    <Box sx={{ my: 8 }}>
      <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
        Popular Locations
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Choose from our most popular rental locations
      </Typography>
      <Grid container spacing={4} justifyContent="center">
        {LOCATIONS.map((loc) => (
          <Grid item xs={12} sm={6} md={4} key={loc.name}>
            <Card sx={{ borderRadius: 4, boxShadow: 3, position: 'relative', height: 280 }}>
              <CardMedia
                component="img"
                height="160"
                image={loc.image}
                alt={loc.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={700} gutterBottom>
                  {loc.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {loc.description}
                </Typography>
                <Chip
                  label={`${loc.cars} cars available`}
                  color={loc.cars > 0 ? 'primary' : 'default'}
                  sx={{ fontWeight: 600 }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default PopularLocations; 