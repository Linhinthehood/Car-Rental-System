const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { isCustomer, isCarProvider } = require('../middlewares/role.middleware');
const { validateBooking, canUpdateBookingStatus, canViewBooking } = require('../middlewares/booking.middleware');
const paginationMiddleware = require('../middlewares/pagination.middleware');
const filterMiddleware = require('../middlewares/filter.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
router.post('/', isCustomer, validateBooking, bookingController.createBooking);
router.post('/calculate-price', bookingController.calculateEstimatedPrice);
router.get('/user', isCustomer, paginationMiddleware, filterMiddleware, bookingController.getUserBookings);
router.get('/:id', canViewBooking, bookingController.getBookingById);
router.patch('/:id/status', canUpdateBookingStatus, bookingController.updateBookingStatus);

module.exports = router; 