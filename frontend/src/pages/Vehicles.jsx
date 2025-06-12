import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card, CardMedia, CardContent, Chip, Pagination, CircularProgress, Stack, Button, Divider, MenuItem, Select, FormControl, InputLabel, ToggleButton, ToggleButtonGroup, FormGroup, FormControlLabel, Checkbox } from '@mui/material';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import SettingsIcon from '@mui/icons-material/Settings';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocalGasStationIcon from '@mui/icons-material/LocalGasStation';
import PersonIcon from '@mui/icons-material/Person';
import api from '../utils/axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

const PAGE_SIZE = 6;
const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || '';

const CAR_TYPES = ['Sedan', 'SUV', 'Hatchback', 'Truck'];
const FUEL_TYPES = ['Gasoline', 'Diesel', 'Hybrid', 'Electric'];
const FEATURES = [
  'Entertainment',
  'Tire Pressure Monitoring System',
  'Spare Tire',
  'Navigation',
  'ETC',
  'Head Up Display',
  'Impact Sensor',
  '360 Camera',
  'Airbags',
  'Reverse Camera',
  'USB Port',
  'GPS',
  'Bluetooth',
  'Sunroof',
];
const PRICE_RANGES = [
  { label: 'Dưới 1 triệu', value: 'lt1' },
  { label: '1 triệu tới 2 triệu', value: '1-2' },
  { label: '2 triệu tới 3 triệu', value: '2-3' },
  { label: 'Trên 3 triệu', value: 'gt3' },
];

const defaultFilters = {
  price: '',
  carType: '',
  transmission: '',
  fuelType: '',
  features: [],
};

const Vehicles = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [filters, setFilters] = useState(defaultFilters);
  const [sort, setSort] = useState('default');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCars = async () => {
      setLoading(true);
      try {
        // Build params cho filter features dạng array
        const params = new URLSearchParams({
          page,
          limit: PAGE_SIZE,
          sort,
          ...Object.fromEntries(Object.entries(filters).filter(([k, v]) => k !== 'features' && v)),
        });
        if (filters.features && filters.features.length > 0) {
          filters.features.forEach(f => params.append('features', f));
        }
        const res = await api.get(`/api/vehicles/available?${params.toString()}`);
        setCars(res.data.data || []);
        setTotalPages(res.data.pagination?.totalPages || 1);
        setTotalCount(res.data.pagination?.total || 0);
      } catch (err) {
        setCars([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };
    fetchCars();
  }, [page, filters, sort]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handleFeatureChange = (feature) => {
    setFilters((prev) => {
      const exists = prev.features.includes(feature);
      return {
        ...prev,
        features: exists ? prev.features.filter(f => f !== feature) : [...prev.features, feature],
      };
    });
    setPage(1);
  };

  const handleCarClick = (carId) => {
    navigate(`/vehicles/${carId}`);
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column" sx={{ background: '#f6f7fb' }}>
      <Navbar />
      <Box sx={{ maxWidth: '1400px', mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, mt: 6, mb: 8 }}>
        <Grid container spacing={4}>
          {/* Bộ lọc bên trái */}
          <Grid item xs={12} md={3}>
            <Box sx={{ p: 3, background: '#fff', borderRadius: 3, boxShadow: 1 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>Filters</Typography>
              <Divider sx={{ mb: 2 }} />
              {/* Price Range */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Price Range</InputLabel>
                <Select
                  name="price"
                  value={filters.price}
                  label="Price Range"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Any Price</MenuItem>
                  {PRICE_RANGES.map(opt => (
                    <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Car Type */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Car Type</InputLabel>
                <Select
                  name="carType"
                  value={filters.carType}
                  label="Car Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">All Types</MenuItem>
                  {CAR_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Transmission */}
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Transmission</Typography>
                <ToggleButtonGroup
                  value={filters.transmission}
                  exclusive
                  onChange={(_, val) => { setFilters(f => ({ ...f, transmission: val || '' })); setPage(1); }}
                  fullWidth
                  color="primary"
                >
                  <ToggleButton value="Automatic">Automatic</ToggleButton>
                  <ToggleButton value="Manual">Manual</ToggleButton>
                </ToggleButtonGroup>
              </Box>
              {/* Fuel Type */}
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Fuel Type</InputLabel>
                <Select
                  name="fuelType"
                  value={filters.fuelType}
                  label="Fuel Type"
                  onChange={handleFilterChange}
                >
                  <MenuItem value="">Any Fuel Type</MenuItem>
                  {FUEL_TYPES.map(type => (
                    <MenuItem key={type} value={type}>{type}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              {/* Features */}
              <Box sx={{ mb: 2 }}>
                <Typography fontWeight={600} sx={{ mb: 1 }}>Features</Typography>
                <FormGroup row sx={{ flexWrap: 'wrap', gap: 1 }}>
                  {FEATURES.map((feature) => (
                    <FormControlLabel
                      key={feature}
                      control={<Checkbox checked={filters.features.includes(feature)} onChange={() => handleFeatureChange(feature)} />}
                      label={feature}
                      sx={{ minWidth: 180, m: 0 }}
                    />
                  ))}
                </FormGroup>
              </Box>
              <Button variant="outlined" color="secondary" onClick={() => { setFilters(defaultFilters); setPage(1); }}>Clear Filters</Button>
            </Box>
          </Grid>
          {/* Danh sách xe */}
          <Grid item xs={12} md={9}>
            <Typography variant="h5" fontWeight={700} align="left" gutterBottom>Danh sách xe</Typography>
            {/* Thẻ tổng số xe và sắp xếp */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2, p: 2, background: '#f7fafd', borderRadius: 2 }}>
              <Typography variant="body1" fontWeight={500}>
                Tổng số xe: {totalCount}
              </Typography>
              <FormControl size="small" sx={{ minWidth: 200 }}>
                <InputLabel>Sort by</InputLabel>
                <Select
                  value={sort}
                  label="Sort by"
                  onChange={e => { setSort(e.target.value); setPage(1); }}
                >
                  <MenuItem value="default">Default</MenuItem>
                  <MenuItem value="price_desc">Price: High to Low</MenuItem>
                  <MenuItem value="price_asc">Price: Low to High</MenuItem>
                </Select>
              </FormControl>
            </Box>
            {loading ? (
              <Stack alignItems="center" sx={{ my: 6 }}>
                <CircularProgress />
              </Stack>
            ) : (
              <>
                <Grid container spacing={4} justifyContent="flex-start">
                  {cars.map((car) => (
                    <Grid item xs={12} sm={6} md={4} key={car._id}>
                      <Card 
                        sx={{ 
                          boxShadow: 3, 
                          borderRadius: 3, 
                          border: '2px solid #e3e8ee', 
                          position: 'relative', 
                          height: 560, 
                          display: 'flex', 
                          flexDirection: 'column', 
                          justifyContent: 'flex-start', 
                          background: '#f7fafd',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            transition: 'transform 0.2s ease-in-out',
                            boxShadow: 6,
                          }
                        }}
                        onClick={() => handleCarClick(car._id)}
                      >
                        <Box sx={{ position: 'absolute', top: 20, right: 20, zIndex: 2 }}>
                          <Chip label={car.status} color={car.status === 'Available' ? 'success' : 'default'} size="small" />
                        </Box>
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
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5, mb: 2 }}>
                            <Chip icon={<DirectionsCarIcon fontSize="small" />} label={car.carType} size="small" />
                            <Chip icon={<SettingsIcon fontSize="small" />} label={car.transmission} size="small" />
                            <Chip icon={<CalendarTodayIcon fontSize="small" />} label={car.modelYear} size="small" />
                            <Chip icon={<LocalGasStationIcon fontSize="small" />} label={car.fuelType} size="small" />
                          </Box>
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
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'flex-end', flexGrow: 1, mt: 2 }}>
                            <Typography variant="h5" color="primary" fontWeight={700} sx={{ ml: 'auto' }}>
                              {car.rentalPricePerDay?.toLocaleString('vi-VN')} ₫ <Typography variant="body2" component="span">/ ngày</Typography>
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
          </Grid>
        </Grid>
      </Box>
      <Footer />
    </Box>
  );
};

export default Vehicles; 