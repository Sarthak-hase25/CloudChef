const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', authController.login);

// We will add the auth middleware later to protect /me
// router.get('/me', authMiddleware, authController.getMe);

module.exports = router;
