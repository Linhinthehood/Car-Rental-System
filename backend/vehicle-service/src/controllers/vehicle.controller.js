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
    const vehicles = await Vehicle.find();
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
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

// Get available vehicles (status: 'Available')
exports.getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ status: 'Available' });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}; 