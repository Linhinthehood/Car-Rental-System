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
    // Xuất lỗi chi tiết hơn
    let errorMessage = 'Unknown error';
    let errorDetail = undefined;
    if (err.response) {
      errorMessage = err.response.data?.error || err.response.statusText;
      errorDetail = err.response.data;
    } else if (err.request) {
      errorMessage = 'No response from user-service';
    } else {
      errorMessage = err.message;
    }
    return res.status(401).json({ 
      error: 'Token verification failed',
      message: errorMessage,
      details: errorDetail
    });
  }
};

module.exports = authenticateToken; 