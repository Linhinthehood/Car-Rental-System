import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Vehicles from './pages/Vehicles';
import CarDetails from './pages/CarDetails';
import ProfilePage from './pages/ProfilePage';
import MyBookings from './pages/MyBookings';
import ManagerCars from './pages/ManagerCars';
import { SnackbarProvider } from 'notistack';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Home />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicles/:id" element={<CarDetails />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/my-rentals" element={<MyBookings />} />
            <Route path="/manager-cars" element={<ManagerCars />} />
          </Routes>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
