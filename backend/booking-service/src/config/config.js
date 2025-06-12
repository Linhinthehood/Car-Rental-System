require('dotenv').config();

const config = {
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  nodeEnv: process.env.NODE_ENV,
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: process.env.JWT_EXPIRES_IN,
  userServiceUrl: process.env.USER_SERVICE_URL,
  vehicleServiceUrl: process.env.VEHICLE_SERVICE_URL
};

console.log('Environment variables:', {
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV,
  USER_SERVICE_URL: process.env.USER_SERVICE_URL,
  VEHICLE_SERVICE_URL: process.env.VEHICLE_SERVICE_URL
});

console.log('Config:', config);

module.exports = config; 