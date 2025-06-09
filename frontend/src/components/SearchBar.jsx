import React, { useState } from 'react';
import { Box, Paper, Grid, Button, MenuItem, TextField } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

const LOCATIONS = [
  { label: 'Ho Chi Minh City', value: 'ho-chi-minh' },
  { label: 'Ha Noi', value: 'ha-noi' },
  { label: 'Da Nang', value: 'da-nang' },
];

const SearchBar = ({ onSearch }) => {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleSearch = () => {
    if (onSearch) {
      onSearch({ location, startDate, endDate });
    }
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', mt: { xs: 2, md: -8 }, zIndex: 2, position: 'relative' }}>
      <Paper elevation={4} sx={{ p: 2, borderRadius: 3, minWidth: { xs: '90%', md: 600 }, maxWidth: 800 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Location"
              value={location}
              onChange={e => setLocation(e.target.value)}
              fullWidth
              size="small"
            >
              {LOCATIONS.map(loc => (
                <MenuItem key={loc.value} value={loc.value}>{loc.label}</MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={5}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <DatePicker
                  label="Start Date"
                  value={startDate}
                  onChange={setStartDate}
                  renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                />
                <DatePicker
                  label="End Date"
                  value={endDate}
                  onChange={setEndDate}
                  renderInput={(params) => <TextField {...params} size="small" fullWidth />}
                />
              </Box>
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              sx={{ height: 48 }}
              onClick={handleSearch}
            >
              Find Cars
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default SearchBar; 