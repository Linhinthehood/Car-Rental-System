import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Checkbox, FormControlLabel, Link, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthBanner from '../components/AuthBanner';
import api from '../utils/axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!formData.agree) {
      setError('You must agree to the Terms and Conditions.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      await api.post('/api/users', {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Grid container component="main" sx={{ flex: 1 }}>
      <AuthBanner 
        image="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2083&q=80"
        position="left"
      />
        <Grid item xs={12} md={6} component={Box} display="flex" alignItems="center" justifyContent="center" sx={{ background: '#fff' }}>
          <Paper elevation={0} sx={{ p: 6, width: '100%', maxWidth: 420, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ mb: 1 }}>
                <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="avatar" width={48} />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Create your account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Join us and start renting premium cars today
              </Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                margin="normal"
                required
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                margin="normal"
                required
                fullWidth
                label="Phone Number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Confirm Password"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                </Grid>
              </Grid>
              <FormControlLabel
                control={<Checkbox name="agree" checked={formData.agree} onChange={handleChange} />}
                label={<span>I agree to the <Link href="#" underline="always">Terms and Conditions</Link></span>}
                sx={{ mt: 1, mb: 2 }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 1, mb: 2 }}
              >
                Create Account
              </Button>
              <Typography variant="body2" align="center">
                Already have an account?{' '}
                <Link component={RouterLink} to="/login" underline="always">
                  Sign in
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
      <Footer />
    </Box>
  );
};

export default Register; 