const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/booking.controller');
const authMiddleware = require('../middlewares/auth.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');
const { validateBooking, canUpdateBookingStatus, canViewBooking, canUpdatePaymentStatus } = require('../middlewares/booking.middleware');
const paginationMiddleware = require('../middlewares/pagination.middleware');
const filterMiddleware = require('../middlewares/filter.middleware');

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Routes
// Car providers can create bookings (as they are also customers)
router.post('/', authorizeRoles('customer', 'car_provider'), validateBooking, bookingController.createBooking);
router.post('/calculate-price', authorizeRoles('customer', 'car_provider'), bookingController.calculateEstimatedPrice);

// Both customers and car providers can view their bookings
router.get('/user', authorizeRoles('customer', 'car_provider'), paginationMiddleware, filterMiddleware, bookingController.getUserBookings);

// Only car providers can view all bookings for their cars
router.get('/provider', authorizeRoles('car_provider'), paginationMiddleware, filterMiddleware, bookingController.getProviderBookings);

// Các route có tham số đặt sau cùng
router.get('/:id', canViewBooking, bookingController.getBookingById);
router.patch('/:id/status', canUpdateBookingStatus, bookingController.updateBookingStatus);
router.patch('/:id/payment', canUpdatePaymentStatus, bookingController.updatePaymentStatus);

module.exports = router; 