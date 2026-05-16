const express = require('express');
const adminController = require('../controllers/admin.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');

const router = express.Router();
const requireAuth = authenticate();

router.get('/stats/overview', requireAuth, adminController.getOverview);
router.get('/stats/revenue', requireAuth, adminController.getRevenue);

router.get('/users', requireAuth, adminController.getUsers);
router.get('/users/:id', requireAuth, adminController.getUserById);
router.post('/users/:id/status', requireAuth, adminController.updateUserStatus);

router.get('/engineers', requireAuth, adminController.getEngineers);
router.get('/engineers/:id', requireAuth, adminController.getEngineerById);
router.post('/engineers/:id/verify', requireAuth, adminController.verifyEngineer);
router.post('/engineers/:id/premium', requireAuth, adminController.updateEngineerPremium);

router.post('/config/machines', requireAuth, adminController.updateMachineConfig);
router.get('/subscriptions/all', requireAuth, adminController.getAllSubscriptions);
router.post('/notifications/broadcast', requireAuth, adminController.broadcastNotification);

module.exports = router;
