const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller.js');

// POST /api/auth/register
router.post('/register', authController.registerUser);

module.exports = router;
