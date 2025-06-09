import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Pagination, CircularProgress, Stack } from '@mui/material';
import api from '../utils/axios';

const PAGE_SIZE = 6;

const FeaturedCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // Giả lập API, sau này thay bằng API thực tế
        const res = await api.get(`/api/vehicles/available?page=${page}&limit=${PAGE_SIZE}`);
        setCars(res.data.vehicles || []);
        setTotalPages(res.data.totalPages || 1);
      } catch (err) {
        setCars([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [page]);

  return (
    <Box sx={{ my: 8 }}>
      <Typography variant="h5" fontWeight={700} align="center" gutterBottom>
        Featured Cars
      </Typography>
      <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
        Discover our most popular rental vehicles
      </Typography>
      {loading ? (
        <Stack alignItems="center" sx={{ my: 6 }}>
          <CircularProgress />
        </Stack>
      ) : (
        <>
          <Grid container spacing={4} justifyContent="center">
            {cars.map((car) => (
              <Grid item xs={12} sm={6} md={4} key={car._id}>
                <Card sx={{ borderRadius: 4, boxShadow: 3, position: 'relative', height: 340 }}>
                  <CardMedia
                    component="img"
                    height="160"
                    image={car.image || 'https://via.placeholder.com/400x200?text=Car+Image'}
                    alt={car.name}
                    sx={{ objectFit: 'contain', background: '#f5f5f5' }}
                  />
                  <CardContent>
                    <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                      {car.brand} {car.model}
                    </Typography>
                    <Typography variant="h6" fontWeight={700} gutterBottom>
                      {car.name}
                    </Typography>
                    <Stack direction="row" spacing={1} sx={{ mb: 1 }}>
                      <Chip label={car.type} size="small" />
                      <Chip label={`${car.seats} seats`} size="small" />
                      <Chip label={car.fuelType} size="small" />
                      <Chip label={car.year} size="small" />
                    </Stack>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {car.features?.slice(0, 4).join(', ')}
                      {car.features && car.features.length > 4 && ` +${car.features.length - 4}`}
                    </Typography>
                    <Stack direction="row" alignItems="center" justifyContent="space-between">
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        {car.price?.toLocaleString('vi-VN')} ₫ <Typography variant="body2" component="span">/ per day</Typography>
                      </Typography>
                      <Chip label="Available" color="success" size="small" />
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Stack alignItems="center" sx={{ mt: 4 }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={(_, value) => setPage(value)}
              color="primary"
              size="large"
            />
          </Stack>
        </>
      )}
    </Box>
  );
};

export default FeaturedCars; 