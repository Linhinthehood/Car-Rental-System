const Booking = require('../models/booking.model');
const { logger } = require('../config/database');
const config = require('../config/config');
const { BOOKING_TYPES, HOURLY_BOOKING_OPTIONS } = require('../constants/booking.types');
const externalService = require('../services/external.service');

// Calculate total price based on booking type and duration
const calculateTotalPrice = (bookingType, hourlyDuration, rentalPricePerDay, startDate, endDate) => {
  if (bookingType === BOOKING_TYPES.HOURLY) {
    const hourlyOption = Object.values(HOURLY_BOOKING_OPTIONS).find(
      option => option.duration === hourlyDuration
    );
    if (!hourlyOption) {
      throw new Error('Invalid hourly duration');
    }
    return rentalPricePerDay * hourlyOption.priceMultiplier;
  }
  
  // For daily bookings
  if (startDate && endDate) {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return rentalPricePerDay * days;
  }
  
  return rentalPricePerDay; // Default case
};

// Create a new booking
const createBooking = async (req, res) => {
  try {
    const { vehicleId, startDate, endDate, bookingType, hourlyDuration } = req.body;
    const userId = req.user.id;
    const token = req.headers.authorization;

    // Verify user exists
    try {
      await externalService.verifyUser(userId, token);
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }

    // Verify vehicle exists and is available
    let vehicle;
    try {
      vehicle = await externalService.verifyVehicle(vehicleId, token);
      if (!vehicle.status || vehicle.status !== 'Available') {
        return res.status(400).json({ message: 'Vehicle is not available' });
      }
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }

    // Validate booking type and duration
    if (bookingType === BOOKING_TYPES.HOURLY && !hourlyDuration) {
      return res.status(400).json({ message: 'Hourly duration is required for hourly bookings' });
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(
      bookingType, 
      hourlyDuration, 
      vehicle.rentalPricePerDay,
      startDate,
      endDate
    );

    const booking = new Booking({
      userId,
      vehicleId,
      car_providerId: vehicle.car_providerId,
      bookingType,
      hourlyDuration: bookingType === BOOKING_TYPES.HOURLY ? hourlyDuration : undefined,
      startDate,
      endDate,
      totalPrice
    });

    await booking.save();
    logger.info(`New booking created: ${booking._id}`);
    res.status(201).json(booking);
  } catch (error) {
    logger.error('Error creating booking:', error);
    res.status(500).json({ message: 'Error creating booking' });
  }
};

// Get all bookings for the authenticated user
const getUserBookings = async (req, res) => {
  try {
    const userId = req.user.id;
    const token = req.headers.authorization;
    const { page, limit, skip } = req.pagination;
    const filter = req.filter;

    // Add user filter
    const queryFilter = {
      userId,
      ...filter
    };

    // Get total count of bookings with filter
    const totalBookings = await Booking.countDocuments(queryFilter);
    const totalPages = Math.ceil(totalBookings / limit);

    // Get paginated bookings with filter
    const bookings = await Booking.find(queryFilter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sort by newest first
    
    // Enrich bookings with user and vehicle details
    const enrichedBookings = await Promise.all(bookings.map(async (booking) => {
      try {
        const [userDetails, vehicleDetails] = await Promise.all([
          externalService.getUserDetails(booking.userId, token),
          externalService.getVehicleDetails(booking.vehicleId, token)
        ]);

        return {
          ...booking.toObject(),
          user: userDetails,
          vehicle: vehicleDetails
        };
      } catch (error) {
        logger.error(`[getUserBookings] Error enriching booking ${booking._id}: ${error.message}`);
        return booking.toObject();
      }
    }));

    res.json({
      bookings: enrichedBookings,
      pagination: {
        page,
        limit,
        totalPages,
        totalBookings,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: filter
    });
  } catch (error) {
    logger.error('Error fetching user bookings:', error);
    res.status(500).json({ message: 'Error fetching bookings' });
  }
};

// Get booking by ID
const getBookingById = async (req, res) => {
  try {
    const token = req.headers.authorization;

    // Enrich booking with user and vehicle details
    try {
      const [userDetails, vehicleDetails] = await Promise.all([
        externalService.getUserDetails(req.booking.userId, token),
        externalService.getVehicleDetails(req.booking.vehicleId, token)
      ]);

      const enrichedBooking = {
        ...req.booking.toObject(),
        user: userDetails,
        vehicle: vehicleDetails
      };

      res.json(enrichedBooking);
    } catch (error) {
      logger.error(`[getBookingById] Error enriching booking ${req.booking._id}: ${error.message}`);
      // If enrichment fails, return basic booking data
      res.json(req.booking);
    }
  } catch (error) {
    logger.error('Error fetching booking:', error);
    res.status(500).json({ message: 'Error fetching booking' });
  }
};

// Update booking status
const updateBookingStatus = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const { status } = req.body;

    // Update booking status
    req.booking.status = status;
    await req.booking.save();

    // Enrich booking with user and vehicle details
    try {
      const [userDetails, vehicleDetails] = await Promise.all([
        externalService.getUserDetails(req.booking.userId, token),
        externalService.getVehicleDetails(req.booking.vehicleId, token)
      ]);

      const enrichedBooking = {
        ...req.booking.toObject(),
        user: userDetails,
        vehicle: vehicleDetails
      };

      res.json(enrichedBooking);
    } catch (error) {
      logger.error(`[updateBookingStatus] Error enriching booking ${req.booking._id}: ${error.message}`);
      // If enrichment fails, return basic booking data
      res.json(req.booking);
    }
  } catch (error) {
    logger.error('Error updating booking:', error);
    res.status(500).json({ message: 'Error updating booking' });
  }
};

// Calculate estimated price
const calculateEstimatedPrice = async (req, res) => {
  try {
    const { vehicleId, bookingType, hourlyDuration, startDate, endDate } = req.body;
    const token = req.headers.authorization;

    // Verify vehicle exists
    let vehicle;
    try {
      vehicle = await externalService.verifyVehicle(vehicleId, token);
    } catch (error) {
      return res.status(error.status).json({ message: error.message });
    }

    // Calculate total price
    const totalPrice = calculateTotalPrice(
      bookingType, 
      hourlyDuration, 
      vehicle.rentalPricePerDay,
      startDate,
      endDate
    );

    res.json({
      totalPrice,
      rentalPricePerDay: vehicle.rentalPricePerDay,
      bookingType,
      hourlyDuration: bookingType === BOOKING_TYPES.HOURLY ? hourlyDuration : null,
      startDate,
      endDate
    });
  } catch (error) {
    logger.error('Error calculating estimated price:', error);
    res.status(500).json({ message: 'Error calculating price' });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  calculateEstimatedPrice
}; 