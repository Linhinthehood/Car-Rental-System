import React, { useState } from 'react';
import { Box, Tabs, Tab, Typography, Container } from '@mui/material';
import BookingManagement from '../components/manager/BookingManagement';
import CarManagement from '../components/manager/CarManagement';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`manager-tabpanel-${index}`}
      aria-labelledby={`manager-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};

const ManagerCars = () => {
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Container maxWidth="lg" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
          Car Management Dashboard
        </Typography>
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={value} onChange={handleChange} aria-label="manager tabs">
            <Tab label="Booking Management" />
            <Tab label="Car Management" />
          </Tabs>
        </Box>

        <TabPanel value={value} index={0}>
          <BookingManagement />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <CarManagement />
        </TabPanel>
      </Container>
      <Footer />
    </Box>
  );
};

export default ManagerCars; 