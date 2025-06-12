const axios = require('axios');
const config = require('../config/config');
const Vehicle = require('../models/vehicle.model');

// Create a new vehicle
exports.createVehicle = async (req, res) => {
  try {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'No token provided' });

    // Gọi user-service để xác thực token
    let userId;
    try {
      const response = await axios.get(`${config.userServiceUrl}/api/users/verify-token`, {
        headers: { Authorization: token }
      });
      userId = response.data.userId || response.data._id;
    } catch (err) {
      return res.status(401).json({ error: 'Invalid token or user-service unavailable' });
    }

    const vehicle = new Vehicle({ ...req.body, car_providerId: userId });
    await vehicle.save();
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all vehicles
exports.getAllVehicles = async (req, res) => {
  try {
    const { brand, seats, carType, minPrice, maxPrice, modelYear, transmission, fuelType, status, page = 1, limit = 10 } = req.query;
    
    // Build filter object
    const filter = {};
    if (brand) filter.brand = brand;
    if (seats) filter.seats = Number(seats);
    if (carType) filter.carType = carType;
    if (modelYear) filter.modelYear = Number(modelYear);
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;
    if (status) filter.status = status;
    if (minPrice || maxPrice) {
      filter.rentalPricePerDay = {};
      if (minPrice) filter.rentalPricePerDay.$gte = Number(minPrice);
      if (maxPrice) filter.rentalPricePerDay.$lte = Number(maxPrice);
    }

    // Calculate pagination
    const skip = (Number(page) - 1) * Number(limit);
    
    // Get vehicles with pagination and filters
    const vehicles = await Vehicle.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });

    // Get total count for pagination
    const total = await Vehicle.countDocuments(filter);

    res.json({
      success: true,
      data: vehicles,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error in getAllVehicles:', err);
    res.status(500).json({ 
      success: false,
      error: 'Internal server error',
      message: 'Failed to retrieve vehicles',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }
};

// Get vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    res.json(vehicle);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    // Chỉ admin hoặc chủ xe mới được sửa
    if (req.user.role !== 'admin' && vehicle.car_providerId.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Forbidden: only owner or admin can update this vehicle' });
    }
    const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.json(updatedVehicle);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) return res.status(404).json({ error: 'Vehicle not found' });
    // Chỉ admin hoặc chủ xe mới được xoá
    if (req.user.role !== 'admin' && vehicle.car_providerId.toString() !== req.user._id) {
      return res.status(403).json({ error: 'Forbidden: only owner or admin can delete this vehicle' });
    }
    await Vehicle.findByIdAndDelete(req.params.id);
    res.json({ message: 'Vehicle deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get vehicles by car provider (user)
exports.getVehicleByUser = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ car_providerId: req.user._id });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get available vehicles (status: 'Available') with filter & pagination
exports.getAvailableVehicles = async (req, res) => {
  try {
    const { brand, seats, carType, price, modelYear, transmission, fuelType, page = 1, limit = 10, sort, features } = req.query;
    const filter = { status: 'Available' };
    if (brand) filter.brand = brand;
    if (seats) filter.seats = Number(seats);
    if (carType) filter.carType = carType;
    if (modelYear) filter.modelYear = Number(modelYear);
    if (transmission) filter.transmission = transmission;
    if (fuelType) filter.fuelType = fuelType;

    // Xử lý price range filter
    if (price) {
      filter.rentalPricePerDay = {};
      switch (price) {
        case 'lt1':
          filter.rentalPricePerDay.$lt = 1000000;
          break;
        case '1-2':
          filter.rentalPricePerDay.$gte = 1000000;
          filter.rentalPricePerDay.$lte = 2000000;
          break;
        case '2-3':
          filter.rentalPricePerDay.$gte = 2000000;
          filter.rentalPricePerDay.$lte = 3000000;
          break;
        case 'gt3':
          filter.rentalPricePerDay.$gt = 3000000;
          break;
      }
    }

    // Thêm filter cho features
    if (features) {
      if (Array.isArray(features)) {
        filter.features = { $all: features };
      } else if (typeof features === 'string') {
        filter.features = { $all: [features] };
      }
    }

    const skip = (Number(page) - 1) * Number(limit);
    
    // Xử lý sort
    let sortOption = {};
    if (sort === 'price_asc') sortOption = { rentalPricePerDay: 1 };
    else if (sort === 'price_desc') sortOption = { rentalPricePerDay: -1 };
    else sortOption = { createdAt: -1 };

    const vehicles = await Vehicle.find(filter)
      .skip(skip)
      .limit(Number(limit))
      .sort(sortOption);

    const total = await Vehicle.countDocuments(filter);
    
    res.json({
      data: vehicles,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  } catch (err) {
    console.error('Error in getAvailableVehicles:', err);
    res.status(500).json({ 
      error: 'Internal server error',
      message: err.message 
    });
  }
};

// Upload vehicle image
exports.uploadVehicleImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const imagePath = '/uploads/vehicles/' + req.file.filename;
  res.status(200).json({ message: 'Image uploaded', imagePath });
}; 