const axios = require('axios');
const config = require('../config/config');

const authenticateToken = async (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) return res.status(401).json({ error: 'No token provided' });

  try {
    const response = await axios.get(`${config.userServiceUrl}/api/users/verify-token`, {
      headers: { Authorization: token }
    });
    req.user = response.data; // Gán toàn bộ thông tin user vào req.user
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token or user-service unavailable' });
  }
};

module.exports = authenticateToken; 