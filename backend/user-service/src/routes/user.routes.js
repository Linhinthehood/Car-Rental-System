const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUser, hashPassword, uploadAvatar } = require('../middlewares/user.middleware');
const { authenticateToken, isAdmin, isCarProvider, isCustomer } = require('../middlewares/auth.middleware');

// Register user
router.post('/', validateUser, hashPassword, userController.createUser);
// Login user
router.post('/login', userController.login);
// Verify token
router.get('/verify-token', userController.verifyToken);
// Get current user info
router.get('/me', authenticateToken, isCarProvider, userController.getCurrentUser);
// Get all users (protected)
router.get('/', authenticateToken, isAdmin, userController.getUsers);
// Get user by id 
router.get('/:id', authenticateToken, userController.getUserById);
// Update user (protected)
router.patch('/me', authenticateToken, isCarProvider, hashPassword, userController.updateUser);
// Update user avatar (protected)
router.patch('/me/avatar', authenticateToken, isCarProvider, uploadAvatar, userController.updateAvatar);
// Delete own account (protected)
router.delete('/me', authenticateToken, isCarProvider, userController.deleteOwnAccount);
// Delete user (protected)
router.delete('/:id', authenticateToken, isAdmin, userController.deleteUser);


module.exports = router;