const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { validateUser, hashPassword } = require('../middlewares/user.middleware');
const { authenticateToken } = require('../middlewares/auth.middleware');

// Register user
router.post('/', validateUser, hashPassword, userController.createUser);
// Login user
router.post('/login', userController.login);
// Get current user info
router.get('/me', authenticateToken, userController.getCurrentUser);
// Get all users (protected)
router.get('/', authenticateToken, userController.getUsers);
// Get user by id (protected)
router.get('/:id', authenticateToken, userController.getUserById);
// Update user (protected)
router.put('/:id', authenticateToken, validateUser, hashPassword, userController.updateUser);
// Delete user (protected)
router.delete('/:id', authenticateToken, userController.deleteUser);

module.exports = router;