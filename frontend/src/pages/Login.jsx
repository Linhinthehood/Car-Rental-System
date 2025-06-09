import React, { useState } from 'react';
import { Box, Grid, Paper, Typography, TextField, Button, Link, FormControlLabel, Checkbox, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AuthBanner from '../components/AuthBanner';
import api from '../utils/axios';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
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
    setLoading(true);
    try {
      const response = await api.post('/api/users/login', {
        email: formData.email,
        password: formData.password,
      });
      localStorage.setItem('token', response.data.token);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box minHeight="100vh" display="flex" flexDirection="column">
      <Navbar />
      <Grid container component="main" sx={{ flex: 1 }}>
        <Grid item xs={12} md={6} component={Box} display="flex" alignItems="center" justifyContent="center" sx={{ background: '#fff' }}>
          <Paper elevation={0} sx={{ p: 6, width: '100%', maxWidth: 420, mx: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 2 }}>
              <Box sx={{ mb: 1 }}>
                <img src="https://cdn-icons-png.flaticon.com/512/747/747376.png" alt="avatar" width={48} />
              </Box>
              <Typography variant="h5" fontWeight={700} gutterBottom>
                Welcome Back
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Please sign in to your account
              </Typography>
            </Box>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
            <Box component="form" onSubmit={handleSubmit}>
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
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
              />
              <Box display="flex" alignItems="center" justifyContent="space-between" sx={{ mt: 1, mb: 2 }}>
                <FormControlLabel
                  control={<Checkbox name="remember" checked={formData.remember} onChange={handleChange} />}
                  label="Remember me"
                />
                <Link href="#" underline="always" variant="body2">
                  Forgot password?
                </Link>
              </Box>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                size="large"
                disabled={loading}
                sx={{ mt: 1, mb: 2 }}
              >
                Sign In
              </Button>
              <Typography variant="body2" align="center">
                Don't have an account?{' '}
                <Link component={RouterLink} to="/register" underline="always">
                  Sign up
                </Link>
              </Typography>
            </Box>
          </Paper>
        </Grid>
        <AuthBanner 
          image="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80"
          position="left"
        />
      </Grid>
      <Footer />
    </Box>
  );
};

export default Login; 