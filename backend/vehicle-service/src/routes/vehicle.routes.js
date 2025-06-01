const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const authenticateToken = require('../middlewares/auth.middleware');
const {authorizeRoles, isAdmin, isCarProvider, isCustomer} = require('../middlewares/role.middleware');
const uploadVehicleImage = require('../middlewares/uploadVehicleImage');

router.post('/', authenticateToken, isCarProvider, vehicleController.createVehicle);
router.get('/available', authenticateToken, isCustomer, vehicleController.getAvailableVehicles);
router.get('/', authenticateToken, isAdmin, vehicleController.getAllVehicles);
router.get('/my-vehicles', authenticateToken, isCarProvider, vehicleController.getVehicleByUser);
router.get('/:id', authenticateToken, vehicleController.getVehicleById);
router.put('/:id', authenticateToken, isCarProvider, vehicleController.updateVehicle);
router.delete('/:id', authenticateToken, isCarProvider, vehicleController.deleteVehicle);
router.post(
  '/upload-image',
  authenticateToken,
  isCarProvider,
  uploadVehicleImage.single('image'),
  vehicleController.uploadVehicleImage
);

module.exports = router; 