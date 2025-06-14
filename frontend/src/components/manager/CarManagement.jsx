import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Typography,
  Button,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Pagination,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import api from '../../utils/axios';

const IMAGE_BASE_URL = process.env.REACT_APP_IMAGE_BASE_URL || '';

const statusOptions = [
  { value: 'Available', label: 'Available' },
  { value: 'Unavailable', label: 'Unavailable' },
];

const CarManagement = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    modelYear: '',
    licensePlate: '',
    rentalPricePerDay: '',
    description: '',
    seats: '',
    carType: '',
    transmission: '',
    fuelType: '',
    status: 'Available',
    images: [],
  });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchCars(page);
    // eslint-disable-next-line
  }, [page]);

  const fetchCars = async (page) => {
    setLoading(true);
    try {
      const response = await api.get(`/api/vehicles/my-vehicles?page=${page}`);
      setCars(response.data.data || response.data.vehicles || response.data);
      setTotalPages(response.data.totalPages || 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
    }
  };

  const handleOpenDialog = (car = null) => {
    if (car) {
      setSelectedCar(car);
      setFormData({ ...car });
    } else {
      setSelectedCar(null);
      setFormData({
        name: '',
        brand: '',
        modelYear: '',
        licensePlate: '',
        rentalPricePerDay: '',
        description: '',
        seats: '',
        carType: '',
        transmission: '',
        fuelType: '',
        status: 'Available',
        images: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCar(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedCar) {
        await api.put(`/api/vehicles/${selectedCar._id}`, formData);
      } else {
        await api.post('/api/vehicles', formData);
      }
      handleCloseDialog();
      fetchCars(page);
    } catch (error) {
      // handle error
    }
  };

  const handleDelete = async (carId) => {
    if (window.confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await api.delete(`/api/vehicles/${carId}`);
        fetchCars(page);
      } catch (error) {
        // handle error
      }
    }
  };

  const handleStatusChange = async (car, newStatus) => {
    try {
      await api.put(`/api/vehicles/${car._id}`, { ...car, status: newStatus });
      fetchCars(page);
    } catch (error) {
      // handle error
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Your Cars</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenDialog()}>
          Add New Vehicle
        </Button>
      </Box>
      <Grid container spacing={3}>
        {cars.length === 0 && (
          <Grid item xs={12}>
            <Typography>No vehicles found.</Typography>
          </Grid>
        )}
        {cars.map((car) => (
          <Grid item xs={12} sm={6} md={4} key={car._id}>
            <Card>
              <CardMedia
                component="img"
                height="160"
                image={
                  car.images && car.images.length > 0
                    ? (car.images[0].startsWith('/uploads')
                        ? `${IMAGE_BASE_URL}${car.images[0]}`
                        : car.images[0])
                    : '/default-car.jpg'
                }
                alt={car.name}
              />
              <CardContent>
                <Typography variant="h6" fontWeight={700}>{car.name}</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">{car.brand} • {car.modelYear}</Typography>
                  <Chip label={car.status} color={car.status === 'Available' ? 'success' : 'default'} size="small" sx={{ mt: 1 }} />
                </Box>
                <Typography variant="h6" fontWeight={700} color="primary.main" sx={{ mt: 1 }}>
                  {car.rentalPricePerDay?.toLocaleString('vi-VN')} đ <Typography component="span" variant="body2" fontWeight={400}>per day</Typography>
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  <strong>License Plate:</strong> {car.licensePlate}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenDialog(car)}>
                  Edit
                </Button>
                <TextField
                  select
                  size="small"
                  value={car.status}
                  onChange={(e) => handleStatusChange(car, e.target.value)}
                  sx={{ minWidth: 120 }}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDelete(car._id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination count={totalPages} page={page} onChange={(e, value) => setPage(value)} />
      </Box>
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{selectedCar ? 'Edit Vehicle' : 'Add New Vehicle'}</DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Car Name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Model Year"
                  name="modelYear"
                  type="number"
                  value={formData.modelYear}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="License Plate"
                  name="licensePlate"
                  value={formData.licensePlate}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price per Day"
                  name="rentalPricePerDay"
                  type="number"
                  value={formData.rentalPricePerDay}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Seats"
                  name="seats"
                  type="number"
                  value={formData.seats}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Car Type"
                  name="carType"
                  value={formData.carType}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Transmission"
                  name="transmission"
                  value={formData.transmission}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Fuel Type"
                  name="fuelType"
                  value={formData.fuelType}
                  onChange={handleInputChange}
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Description"
                  name="description"
                  multiline
                  rows={3}
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Status"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  {statusOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {selectedCar ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CarManagement; 