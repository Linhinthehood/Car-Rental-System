import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Pagination, CircularProgress, Stack } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PersonIcon from '@mui/icons-material/Person';
import api from '../utils/axios';

const PAGE_SIZE = 6;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || '';

const FeaturedCars = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // Gọi API gateway lấy danh sách xe khả dụng
        const res = await api.get(`/api/vehicles/available?page=${page}&limit=${PAGE_SIZE}`);
        setCars(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
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
                <Card sx={{ boxShadow: 3, borderRadius: 3, border: '2px solid #e3e8ee', position: 'relative', height: 520, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', background: '#f7fafd' }}>
                  {/* Status ở góc phải trên */}
                  <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
                    <Chip label={car.status} color={car.status === 'Available' ? 'success' : 'default'} size="small" />
                  </Box>
                  {/* Ảnh đầu tiên */}
                  <CardMedia
                    component="img"
                    image={
                      car.images && car.images.length > 0
                        ? (car.images[0].startsWith('/uploads')
                            ? `${IMAGE_BASE_URL}${car.images[0]}`
                            : car.images[0])
                        : ''
                    }
                    alt={car.name}
                    sx={{
                      width: '100%',
                      height: 260,
                      objectFit: 'cover',
                      background: '#f5f5f5',
                      borderTopLeftRadius: 12,
                      borderTopRightRadius: 12,
                      borderBottomLeftRadius: 0,
                      borderBottomRightRadius: 0,
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', p: 3 }}>
                    {/* Tên xe và provider */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {car.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <PersonIcon fontSize="small" color="primary" />
                        <Typography variant="body2" fontWeight={500} color="primary">
                          {car.car_providerName || 'Provider'}
                        </Typography>
                      </Box>
                    </Box>
                    {/* carType, transmission, modelYear, fuelType */}
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                      <Chip icon={<DirectionsCarIcon fontSize="small" />} label={car.carType} size="small" />
                      <Chip icon={<SettingsIcon fontSize="small" />} label={car.transmission} size="small" />
                      <Chip icon={<CalendarTodayIcon fontSize="small" />} label={car.modelYear} size="small" />
                      <Chip icon={<LocalGasStationIcon fontSize="small" />} label={car.fuelType} size="small" />
                    </Box>
                    {/* Features */}
                    <Box sx={{ mb: 3, minHeight: 36 }}>
                      {car.features && car.features.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, rowGap: 1.5 }}>
                          {car.features.slice(0, 4).map((feature, idx) => (
                            <Chip key={idx} label={feature} size="small" color="info" variant="outlined" />
                          ))}
                          {car.features.length > 4 && (
                            <Chip label={`+${car.features.length - 4}`} size="small" variant="outlined" />
                          )}
                        </Box>
                      )}
                    </Box>
                    {/* Giá thuê ở góc phải dưới cùng */}
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexGrow: 1, mt: 2 }}>
                      <Typography variant="h5" color="primary" fontWeight={700} sx={{ ml: 'auto' }}>
                        {car.rentalPricePerDay?.toLocaleString('vi-VN')} ₫ <Typography variant="body2" component="span">/ per day</Typography>
                      </Typography>
                    </Box>
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