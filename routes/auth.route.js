const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

// POST /api/auth/register
router.post('/register', authController.registerUser);

// OTP Auth routes
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
