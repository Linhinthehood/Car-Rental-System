const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { connectDB, logger } = require('./config/database');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const bookingRoutes = require('./routes/booking.routes');
app.use('/api/bookings', bookingRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Connect to MongoDB and start server
connectDB().then(() => {
  const PORT = config.port || 3003;
  app.listen(PORT, () => {
    logger.info(`Booking service is running on port ${PORT}`);
  });
}); 