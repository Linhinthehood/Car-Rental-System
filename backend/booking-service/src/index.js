const express = require('express');
const cors = require('cors');
const config = require('./config/config');
const { connectDB, logger } = require('./config/database');
const http = require('http');
const socketio = require('socket.io');

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
  const PORT = config.port;
  const server = http.createServer(app);
  const io = socketio(server, { cors: { origin: '*' } });
  app.locals.io = io;

  io.on('connection', (socket) => {
    logger.info('User connected: ' + socket.id);
    socket.on('join', (userId) => {
      socket.join(userId);
    });
  });

  server.listen(PORT, () => {
    logger.info(`Booking service is running on port ${PORT}`);
  });
}); 