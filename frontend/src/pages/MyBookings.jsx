import React, { useEffect, useState, useRef } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Button, Divider, Select, MenuItem, FormControl, InputLabel, Stack } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import api from '../utils/axios';
import { io } from 'socket.io-client';

const STATUS_OPTIONS = [
  { label: 'All Status', value: '' },
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved' },
  { label: 'Started', value: 'started' },
  { label: 'Completed', value: 'completed' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Cancelled', value: 'cancelled' },
];

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || '';
const SOCKET_URL = `${process.env.REACT_APP_API_URL}/ws/booking`;
const SOCKET_PATH = '/ws/bookings';

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'warning';
    case 'approved': return 'success';
    case 'started': return 'info';
    case 'completed': return 'primary';
    case 'rejected': return 'error';
    case 'cancelled': return 'default';
    default: return 'default';
  }
};

const MyBookings = () => {
  const [statusFilter, setStatusFilter] = useState('');
  const [bookings, setBookings] = useState([]);
  const socketRef = useRef();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await api.get('/api/bookings/user');
        console.log('API bookings response:', res.data.bookings);
        setBookings(res.data.bookings || []);
      } catch (err) {
        setBookings([]);
      }
    };
    fetchBookings();

    // Kết nối socket qua API Gateway
    socketRef.current = io(SOCKET_URL, { path: SOCKET_PATH, transports: ['websocket'] });
    // Lấy userId từ localStorage
    const userId = localStorage.getItem('userId');
    if (userId) {
      socketRef.current.emit('join', userId);
    }

    // Lắng nghe sự kiện booking mới
    socketRef.current.on('newBooking', (data) => {
      setBookings(prev => [data, ...prev]);
    });

    // Lắng nghe sự kiện cập nhật trạng thái booking
    socketRef.current.on('bookingStatusUpdated', (data) => {
      setBookings(prev =>
        prev.map(b =>
          b._id === data._id ? data : b
        )
      );
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const filteredBookings = statusFilter
    ? bookings.filter(b => b.status === statusFilter)
    : bookings;

  const handleCancelBooking = async (bookingId) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/status`, { status: 'cancelled' });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'cancelled' } : b));
    } catch (err) {
      alert('Failed to cancel booking!');
    }
  };

  const handleStartBooking = async (bookingId) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/status`, { status: 'started' });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, status: 'started' } : b));
    } catch (err) {
      alert('Failed to start booking!');
    }
  };

  const handlePayment = async (bookingId) => {
    try {
      await api.patch(`/api/bookings/${bookingId}/payment`, { paymentStatus: 'paid' });
      setBookings(prev => prev.map(b => b._id === bookingId ? { ...b, paymentStatus: 'paid' } : b));
    } catch (err) {
      alert('Thanh toán thất bại!');
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: '#f6f7fb' }}>
      <Navbar />
      <Box sx={{ maxWidth: '1100px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, mt: 6, mb: 8 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" fontWeight={700}>My Bookings</Typography>
          <FormControl size="small" sx={{ minWidth: 180 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusFilter}
              label="Status"
              onChange={e => setStatusFilter(e.target.value)}
            >
              {STATUS_OPTIONS.map(opt => (
                <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
        <Grid container spacing={3}>
          {filteredBookings.map(booking => {
            const vehicle = booking.vehicle?.data || {};
            const provider = vehicle.car_provider || {};
            const imageUrl = vehicle.images?.[0]
              ? (vehicle.images[0].startsWith('/uploads')
                  ? `${IMAGE_BASE_URL}${vehicle.images[0]}`
                  : vehicle.images[0])
              : '/placeholder-car.jpg';
            return (
              <Grid item xs={12} key={booking._id}>
                <Card sx={{ display: 'flex', p: 2, alignItems: 'center' }}>
                  <CardMedia
                    component="img"
                    image={imageUrl}
                    alt={vehicle.name || 'Car'}
                    sx={{ width: 320, height: 200, objectFit: 'cover', borderRadius: 3, mr: 5 }}
                  />
                  <CardContent sx={{ flex: 1, p: 0 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Typography variant="h6" fontWeight={700} sx={{ mb: 0, color: 'primary.main' }}>{vehicle.name || 'Car'}</Typography>
                      <Chip label={booking.status} color={getStatusColor(booking.status)} sx={{ fontSize: 15, px: 2, py: 1, height: 32, borderRadius: 8 }} />
                    </Box>
                    <Divider sx={{ mb: 2 }} />
                    <Box sx={{ display: 'flex', gap: 8, mb: 2, alignItems: 'flex-start' }}>
                      <Box sx={{ minWidth: 200, background: '#f7fafd', borderRadius: 2, p: 2, boxShadow: 1, border: '2px solid #e3e8ee' }}>
                        <Typography fontWeight={600} sx={{ color: 'primary.main', fontSize: 16, mb: 1 }}>Booking Period</Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary' }}>
                          From: <span style={{ color: '#1976d2', fontWeight: 700 }}>{booking.startDate ? new Date(booking.startDate).toLocaleString('vi-VN') : '--'}</span>
                        </Typography>
                        <Typography variant="body2" fontWeight={600} sx={{ color: 'text.secondary' }}>
                          To: <span style={{ color: '#1976d2', fontWeight: 700 }}>{booking.endDate ? new Date(booking.endDate).toLocaleString('vi-VN') : '--'}</span>
                        </Typography>
                      </Box>
                      <Box sx={{ minWidth: 200}}>
                        <Typography fontWeight={600} sx={{ fontSize: 16, mb: 1 }}>Provider Information</Typography>
                        <Typography variant="body2">Name: {provider.name || '--'}</Typography>
                        <Typography variant="body2">Email: {provider.email || '--'}</Typography>
                        <Typography variant="body2">Phone: {provider.phoneNumber || '--'}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 8, mb: 2, alignItems: 'flex-start' }}>
                      <Box>
                        <Typography fontWeight={600} sx={{ fontSize: 16, mb: 1 }}>Status History</Typography>
                        {booking.statusHistory?.map((s, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Chip size="small"
                              label={s.status}
                              sx={{ mr: 1 }}
                              color={getStatusColor(s.status)}
                            />
                            <Typography variant="body2" component="span">
                              {s.changedAt ? new Date(s.changedAt).toLocaleString('vi-VN') : '--'}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                      <Box sx={{ minWidth: 200, ml: '2' }}>
                        <Typography fontWeight={600} sx={{ fontSize: 16, mb: 1 }}>Payment History</Typography>
                        {booking.paymentHistory?.map((p, idx) => (
                          <Box key={idx} sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                            <Chip size="small" label={p.status} color={p.status === 'unpaid' ? 'error' : 'success'} sx={{ mr: 1 }} />
                            <Typography variant="body2" component="span">
                              {p.changedAt ? new Date(p.changedAt).toLocaleString('vi-VN') : '--'}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 3 }}>
                      <Typography variant="h6" fontWeight={700}>
                        Total Price: <span style={{ color: '#1976d2' }}>{booking.totalPrice?.toLocaleString('vi-VN') || '--'} ₫</span>
                        <Chip label={booking.paymentStatus} color={booking.paymentStatus === 'unpaid' ? 'error' : 'success'} size="medium" sx={{ ml: 2, fontSize: 15, px: 2, py: 1, height: 28, borderRadius: 8 }} />
                      </Typography>
                      {booking.status === 'pending' && booking.paymentStatus === 'unpaid' && (
                        <Button variant="contained" color="error" onClick={() => handleCancelBooking(booking._id)} sx={{ fontSize: 15, px: 3, py: 1, borderRadius: 8 }}>
                          Cancel Booking
                        </Button>
                      )}
                      {booking.status === 'approved' && booking.paymentStatus === 'unpaid' && (
                        <Button variant="contained" color="success" onClick={() => handlePayment(booking._id)} sx={{ fontSize: 15, px: 3, py: 1, borderRadius: 8 }}>
                          Pay
                        </Button>
                      )}
                      {booking.status === 'approved' && booking.paymentStatus === 'paid' && (
                        <Button variant="contained" color="primary" onClick={() => handleStartBooking(booking._id)} sx={{ fontSize: 15, px: 3, py: 1, borderRadius: 8 }}>
                          Start Booking
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
        {filteredBookings.length === 0 && (
          <Stack alignItems="center" sx={{ mt: 6 }}>
            <Typography>No bookings found.</Typography>
          </Stack>
        )}
      </Box>
      <Footer />
    </Box>
  );
};

export default MyBookings; 