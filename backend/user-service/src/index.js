const fs = require('fs');
const path = require('path');
const avatarDir = path.resolve(__dirname, '../../uploads/avatar');
if (!fs.existsSync(avatarDir)) {
  fs.mkdirSync(avatarDir, { recursive: true });
}
const express = require('express');
const cors = require('cors');
const winston = require('winston');
const connectDB = require('./config/database');
const config = require('./config/config');
const userRoutes = require('./routes/user.routes');

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Serve static avatar
app.use('/uploads/avatar', express.static(avatarDir));

// Logger configuration
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (config.nodeEnv !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

// Connect to MongoDB
connectDB();

// Routes
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'user-service' });
});

app.use('/api/users', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: 'Something went wrong!'
  });
});

// Start server
app.listen(config.port, () => {
  logger.info(`User service is running on port ${config.port}`);
});
