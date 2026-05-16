const express = require('express');
const authController = require('../controllers/auth.controller.js');
const callController = require('../controllers/call.controller.js');
const subscriptionController = require('../controllers/subscription.controller.js');
const userAuthController = require('../controllers/userAuth.controller.js');
const userController = require('../controllers/user.controller.js');
const userEngineerController = require('../controllers/userEngineer.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');

const router = express.Router();
const requireUser = authenticate(['USER']);

router.post('/auth/send-otp', authController.sendOTP);
router.post('/auth/verify-otp', authController.verifyOTP);
router.post('/auth/register', userAuthController.register);

router.get('/profile', requireUser, userController.getProfile);

router.post('/engineers/search', requireUser, userEngineerController.searchEngineers);
router.get('/engineers/:id', requireUser, userEngineerController.getEngineerById);

router.get('/subscription/status', requireUser, subscriptionController.getStatus);
router.get('/subscription/plans', requireUser, subscriptionController.getPlans);
router.post('/subscription/purchase', requireUser, subscriptionController.purchase);

router.post('/calls/log', requireUser, callController.logUserCall);
router.get('/calls/history', requireUser, callController.getUserCallHistory);

module.exports = router;
