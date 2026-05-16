const express = require('express');
const callController = require('../controllers/call.controller.js');
const engineerAuthController = require('../controllers/engineerAuth.controller.js');
const engineerController = require('../controllers/engineer.controller.js');
const engineerOtpController = require('../controllers/engineerOtp.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');

const router = express.Router();
const requireEngineer = authenticate(['ENGINEER']);

router.post('/auth/send-otp', engineerOtpController.sendOTP);
router.post('/auth/verify-otp', engineerOtpController.verifyOTP);
router.post('/auth/register', engineerAuthController.register);

router.get('/profile', requireEngineer, engineerController.getProfile);
router.put('/profile/update', requireEngineer, engineerController.updateProfile);
router.post('/profile/status', requireEngineer, engineerController.updateStatus);

router.get('/calls/history', requireEngineer, callController.getEngineerCallHistory);

module.exports = router;
