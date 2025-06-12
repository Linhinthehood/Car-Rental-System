import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Paper,
  Divider,
  Chip,
  Avatar,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import Carousel from 'react-material-ui-carousel';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import api from '../utils/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

// Fix for default marker icon in Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const BOOKING_TYPES = {
  DAILY: 'daily',
  HOURLY: 'hourly',
};

const HOURLY_OPTIONS = [
  { value: 6, label: '6 hours' },
  { value: 8, label: '8 hours' },
  { value: 12, label: '12 hours' },
];

const CarDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingType, setBookingType] = useState(BOOKING_TYPES.DAILY);
  const [pickupDate, setPickupDate] = useState(null);
  const [returnDate, setReturnDate] = useState(null);
  const [hourlyDuration, setHourlyDuration] = useState(6);
  const [estimatedPrice, setEstimatedPrice] = useState(null);
  const [pickupTime, setPickupTime] = useState('09:00');
  const [returnTime, setReturnTime] = useState('09:00');

  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        const response = await api.get(`/api/vehicles/${id}`);
        if (response.data && response.data.data) {
          setCar(response.data.data);
        } else {
          setCar(null);
        }
      } catch (error) {
        console.error('Error fetching car details:', error);
        setCar(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCarDetails();
  }, [id, navigate]);

  const handleBookingTypeChange = (event) => {
    setBookingType(event.target.value);
    // Reset dates when changing booking type
    setPickupDate(null);
    setReturnDate(null);
    setEstimatedPrice(null);
  };

  const handlePickupDateChange = (newDate) => {
    setPickupDate(newDate);
    // Reset return date if it's before new pickup date
    if (returnDate && newDate > returnDate) {
      setReturnDate(null);
    }
  };

  const handleReturnDateChange = (newDate) => {
    setReturnDate(newDate);
  };

  const handleHourlyDurationChange = (event) => {
    setHourlyDuration(event.target.value);
  };

  // Helper để ghép ngày và giờ thành ISO string
  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hours, minutes] = time.split(':');
    const newDate = new Date(date);
    newDate.setHours(Number(hours), Number(minutes), 0, 0);
    return newDate.toISOString();
  };

  // Helper để tính endDate cho thuê theo giờ
  const getHourlyEndDate = useCallback(() => {
    if (!pickupDate || !pickupTime || !hourlyDuration) return null;
    const [hours, minutes] = pickupTime.split(':');
    const start = new Date(pickupDate);
    start.setHours(Number(hours), Number(minutes), 0, 0);
    const end = new Date(start);
    end.setHours(end.getHours() + Number(hourlyDuration));
    return end.toISOString();
  }, [pickupDate, pickupTime, hourlyDuration]);

  useEffect(() => {
    const calculatePrice = async () => {
      if (!car) return;
      // Validate required fields based on booking type
      if (bookingType === BOOKING_TYPES.DAILY) {
        if (!pickupDate || !returnDate || !pickupTime || !returnTime) {
          setEstimatedPrice(null);
          return;
        }
      } else {
        if (!pickupDate || !pickupTime) {
          setEstimatedPrice(null);
          return;
        }
      }

      try {
        const startDate = combineDateTime(pickupDate, pickupTime);
        const endDate = bookingType === BOOKING_TYPES.DAILY
          ? combineDateTime(returnDate, returnTime)
          : getHourlyEndDate();

        const response = await api.post('/api/bookings/calculate-price', {
          vehicleId: car._id,
          bookingType,
          hourlyDuration: bookingType === BOOKING_TYPES.HOURLY ? hourlyDuration : null,
          startDate,
          endDate
        });

        if (response.data) {
          if (bookingType === BOOKING_TYPES.HOURLY && response.data.totalPrice === null) {
            const hourlyRate = car.rentalPricePerDay / 24;
            const totalPrice = hourlyRate * hourlyDuration;
            setEstimatedPrice(Math.round(totalPrice));
          } else {
            setEstimatedPrice(response.data.totalPrice);
          }
        } else {
          setEstimatedPrice(null);
        }
      } catch (error) {
        setEstimatedPrice(null);
      }
    };

    calculatePrice();
  }, [car, bookingType, pickupDate, returnDate, hourlyDuration, pickupTime, returnTime, getHourlyEndDate]);

  const handleBooking = async () => {
    try {
      const bookingData = {
        vehicleId: car._id,
        startDate: combineDateTime(pickupDate, pickupTime),
        endDate: bookingType === BOOKING_TYPES.DAILY ? combineDateTime(returnDate, returnTime) : getHourlyEndDate(),
        bookingType,
        hourlyDuration: bookingType === BOOKING_TYPES.HOURLY ? hourlyDuration : null,
      };
      await api.post('/api/bookings', bookingData);
      navigate('/my-rentals');
    } catch (error) {
      console.error('Error creating booking:', error);
    }
  };

  if (loading) {
    return (
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  if (!car) {
    return (
      <Box minHeight="100vh" display="flex" flexDirection="column">
        <Navbar />
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Typography>Car not found</Typography>
        </Box>
        <Footer />
      </Box>
    );
  }

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: '#f6f7fb' }}>
      <Navbar />
      <Box sx={{ maxWidth: '1400px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, mt: 6, mb: 8 }}>
        {/* Image Carousel */}
        <Box sx={{ mb: 4 }}>
          <Carousel
            interval={4000}
            animation="fade"
            indicators={true}
            navButtonsAlwaysVisible={true}
          >
            {car.images && car.images.length > 0 ? (
              car.images.map((image, index) => (
                <Box
                  key={index}
                  component="img"
                  src={image.startsWith('/uploads') ? `${process.env.REACT_APP_IMAGE_BASE_URL}${image}` : image}
                  alt={`${car.name} - Image ${index + 1}`}
                  sx={{
                    width: '100%',
                    height: '500px',
                    objectFit: 'cover',
                    borderRadius: 2,
                  }}
                />
              ))
            ) : (
              <Box
                component="img"
                src="/placeholder-car.jpg"
                alt="No image available"
                sx={{
                  width: '100%',
                  height: '500px',
                  objectFit: 'cover',
                  borderRadius: 2,
                }}
              />
            )}
          </Carousel>
        </Box>

        <Grid container spacing={4}>
          {/* Left Column - Car Information */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h4" fontWeight={700} gutterBottom>
                {car.name}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <Chip icon={<DirectionsCarIcon />} label={car.carType} />
                <Chip icon={<SettingsIcon />} label={car.transmission} />
                <Chip icon={<CalendarTodayIcon />} label={car.modelYear} />
                <Chip icon={<LocalGasStationIcon />} label={car.fuelType} />
              </Box>
              <Typography variant="body1" paragraph>
                {car.description}
              </Typography>
              <Divider sx={{ my: 3 }} />
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Features
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {car.features.map((feature, index) => (
                  <Chip key={index} label={feature} variant="outlined" />
                ))}
              </Box>
            </Paper>

            {/* Location Map */}
            <Paper sx={{ p: 3, mb: 4 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Location
              </Typography>
              <Box sx={{ height: 300, width: '100%', borderRadius: 2, overflow: 'hidden' }}>
                {car.location && car.location.lat && car.location.lng ? (
                  <MapContainer
                    center={[car.location.lat, car.location.lng]}
                    zoom={13}
                    style={{ height: '100%', width: '100%' }}
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={[car.location.lat, car.location.lng]}>
                      <Popup>
                        {car.name}
                      </Popup>
                    </Marker>
                  </MapContainer>
                ) : (
                  <Box sx={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Typography color="text.secondary">Location not available</Typography>
                  </Box>
                )}
              </Box>
            </Paper>

            {/* Car Provider Information */}
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>
                Car Provider Information
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3, mt: 2 }}>
                <Avatar 
                  src={car.car_provider?.avatar || '/uploads/avatar/user.png'} 
                  alt={car.car_provider?.name}
                  sx={{ 
                    width: 80, 
                    height: 80,
                    border: '2px solid #e3e8ee'
                  }} 
                />
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" fontWeight={600} gutterBottom>
                    {car.car_provider?.name || 'Unknown Provider'}
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                        Email:
                      </Typography>
                      <Typography variant="body2">
                        {car.car_provider?.email || 'Not available'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                        Phone:
                      </Typography>
                      <Typography variant="body2">
                        {car.car_provider?.phoneNumber || 'Not available'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 100 }}>
                        Role:
                      </Typography>
                      <Typography variant="body2" sx={{ 
                        textTransform: 'capitalize',
                        color: 'primary.main',
                        fontWeight: 500
                      }}>
                        {car.car_provider?.role || 'Not available'}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Booking Form */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, position: 'sticky', top: 100 }}>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Book Now
              </Typography>
              <Typography variant="h4" color="primary" fontWeight={700} gutterBottom>
                {car.rentalPricePerDay.toLocaleString('vi-VN')} ₫
                <Typography component="span" variant="body1" color="text.secondary">
                  /day
                </Typography>
              </Typography>

              <FormControl component="fieldset" sx={{ mb: 3 }}>
                <RadioGroup
                  value={bookingType}
                  onChange={handleBookingTypeChange}
                >
                  <FormControlLabel
                    value={BOOKING_TYPES.DAILY}
                    control={<Radio />}
                    label="Daily Rental"
                  />
                  <FormControlLabel
                    value={BOOKING_TYPES.HOURLY}
                    control={<Radio />}
                    label="Hourly Rental"
                  />
                </RadioGroup>
              </FormControl>

              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                  <DatePicker
                    label="Pickup Date"
                    value={pickupDate}
                    onChange={handlePickupDateChange}
                    renderInput={(params) => <TextField {...params} fullWidth />}
                    minDate={new Date()}
                  />
                  <TextField
                    label="Pickup Time"
                    type="time"
                    value={pickupTime}
                    onChange={e => setPickupTime(e.target.value)}
                    InputLabelProps={{ shrink: true }}
                    inputProps={{ step: 300 }}
                    sx={{ width: 140 }}
                  />
                </Box>
                {bookingType === BOOKING_TYPES.DAILY && (
                  <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
                    <DatePicker
                      label="Return Date"
                      value={returnDate}
                      onChange={handleReturnDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDate={pickupDate || new Date()}
                    />
                    <TextField
                      label="Return Time"
                      type="time"
                      value={returnTime}
                      onChange={e => setReturnTime(e.target.value)}
                      InputLabelProps={{ shrink: true }}
                      inputProps={{ step: 300 }}
                      sx={{ width: 140 }}
                    />
                  </Box>
                )}
                {bookingType === BOOKING_TYPES.HOURLY && (
                  <FormControl fullWidth sx={{ mb: 3 }}>
                    <InputLabel>Duration</InputLabel>
                    <Select
                      value={hourlyDuration}
                      label="Duration"
                      onChange={handleHourlyDurationChange}
                    >
                      {HOURLY_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                          {option.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              </LocalizationProvider>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" fontWeight={600}>
                  Total Price
                </Typography>
                <Typography variant="h4" color="primary" fontWeight={700}>
                  {estimatedPrice ? (
                    <>
                      {estimatedPrice.toLocaleString('vi-VN')} ₫
                      <Typography component="span" variant="body1" color="text.secondary">
                        {bookingType === BOOKING_TYPES.DAILY ? ' / total' : ' / hourly'}
                      </Typography>
                    </>
                  ) : (
                    <>
                      {car.rentalPricePerDay.toLocaleString('vi-VN')} ₫
                      <Typography component="span" variant="body1" color="text.secondary">
                        /day
                      </Typography>
                    </>
                  )}
                </Typography>
              </Box>

              <Button
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                onClick={handleBooking}
                disabled={!pickupDate || (bookingType === BOOKING_TYPES.DAILY && !returnDate)}
              >
                Book Now
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default CarDetails; 