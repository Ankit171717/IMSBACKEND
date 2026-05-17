const express = require('express');
const adminAuthController = require('../controllers/adminAuth.controller.js');
const adminController = require('../controllers/admin.controller.js');
const { authenticate } = require('../middleware/auth.middleware.js');

const router = express.Router();
const requireAdmin = authenticate(['ADMIN']);

router.post('/auth/login', adminAuthController.login);

router.get('/stats/overview', requireAdmin, adminController.getOverview);
router.get('/stats/revenue', requireAdmin, adminController.getRevenue);

router.get('/users', requireAdmin, adminController.getUsers);
router.get('/users/:id', requireAdmin, adminController.getUserById);
router.post('/users/:id/status', requireAdmin, adminController.updateUserStatus);

router.get('/engineers', requireAdmin, adminController.getEngineers);
router.get('/engineers/:id', requireAdmin, adminController.getEngineerById);
router.post('/engineers/:id/verify', requireAdmin, adminController.verifyEngineer);
router.post('/engineers/:id/premium', requireAdmin, adminController.updateEngineerPremium);

router.post('/config/machines', requireAdmin, adminController.updateMachineConfig);
router.get('/subscriptions/all', requireAdmin, adminController.getAllSubscriptions);
router.post('/notifications/broadcast', requireAdmin, adminController.broadcastNotification);

module.exports = router;
