import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Chip,
  Divider,
  Button,
  TextField,
  Stack,
  Rating,
  Avatar,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import api from '../utils/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || '';
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY;

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [totalDays, setTotalDays] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);

  useEffect(() => {
    const fetchCarDetails = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { state: { from: `/vehicles/${id}` } });
        return;
      }

      try {
        const response = await api.get(`/api/vehicles/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setCar(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          // Token hết hạn hoặc không hợp lệ
          localStorage.removeItem('token');
          navigate('/login', { state: { from: `/vehicles/${id}` } });
        } else {
          console.error('Error fetching car details:', error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  useEffect(() => {
    if (startDate && endDate) {
      const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
      setTotalDays(days);
      if (car) {
        setTotalPrice(days * car.rentalPricePerDay);
      }
    }
  }, [startDate, endDate, car]);

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (!car) {
    return (
      <Box minHeight="100vh" display="flex" alignItems="center" justifyContent="center">
        <Typography>Car not found</Typography>
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: '#f6f7fb' }}>
      <Navbar />
      <Box sx={{ maxWidth: '1400px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, mt: 6, mb: 8 }}>
        {/* Image Carousel */}
        <Paper sx={{ mb: 4, borderRadius: 3, overflow: 'hidden' }}>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={0}
            slidesPerView={1}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            style={{ height: '500px' }}
          >
            {car.images?.map((image, index) => (
              <SwiperSlide key={index}>
                <img
                  src={image.startsWith('/uploads') ? `${IMAGE_BASE_URL}${image}` : image}
                  alt={`${car.name} - ${index + 1}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </Paper>

        <Grid container spacing={4}>
          {/* Left Column - Car Information */}
          <Grid item xs={12} md={7}>
            {/* Car Basic Info */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {car.name}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                <Chip icon={<DirectionsCarIcon />} label={car.carType} />
                <Chip icon={<SettingsIcon />} label={car.transmission} />
                <Chip icon={<CalendarTodayIcon />} label={car.modelYear} />
                <Chip icon={<LocalGasStationIcon />} label={car.fuelType} />
              </Stack>
              <Typography variant="h5" color="primary" fontWeight={700} gutterBottom>
                {car.rentalPricePerDay?.toLocaleString('vi-VN')} ₫ <Typography component="span" variant="body1">/ ngày</Typography>
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="body1" paragraph>
                {car.description}
              </Typography>
            </Paper>

            {/* Features */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {car.features?.map((feature, index) => (
                  <Chip key={index} label={feature} color="primary" variant="outlined" />
                ))}
              </Box>
            </Paper>

            {/* Location */}
            <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Location
              </Typography>
              <Box sx={{ height: '400px', width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
                  <GoogleMap
                    mapContainerStyle={{ width: '100%', height: '100%' }}
                    center={{ lat: car.location?.lat || 10.762622, lng: car.location?.lng || 106.660172 }}
                    zoom={15}
                  >
                    <Marker
                      position={{ lat: car.location?.lat || 10.762622, lng: car.location?.lng || 106.660172 }}
                    />
                  </GoogleMap>
                </LoadScript>
              </Box>
            </Paper>

            {/* Car Provider Info */}
            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Car Provider
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Avatar sx={{ width: 64, height: 64 }} />
                <Box>
                  <Typography variant="h6">{car.car_providerName}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Rating value={4.5} precision={0.5} readOnly size="small" />
                    <Typography variant="body2" color="text.secondary">
                      (4.5)
                    </Typography>
                  </Stack>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Booking Form */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, borderRadius: 3, position: 'sticky', top: 20 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>
                Book This Car
              </Typography>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Stack spacing={3}>
                  <DatePicker
                    label="Start Date"
                    value={startDate}
                    onChange={setStartDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={new Date()}
                  />
                  <DatePicker
                    label="End Date"
                    value={endDate}
                    onChange={setEndDate}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={startDate || new Date()}
                  />
                  {totalDays > 0 && (
                    <Box sx={{ mt: 2 }}>
                      <Typography variant="body1" gutterBottom>
                        Total Days: {totalDays}
                      </Typography>
                      <Typography variant="h6" color="primary" fontWeight={700}>
                        Total Price: {totalPrice?.toLocaleString('vi-VN')} ₫
                      </Typography>
                    </Box>
                  )}
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    disabled={!startDate || !endDate}
                    sx={{ mt: 2 }}
                  >
                    Book Now
                  </Button>
                </Stack>
              </LocalizationProvider>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default CarDetails; 