const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');

// POST /api/notifications/broadcast - Broadcast notification to all clients
router.post('/broadcast', notificationController.broadcastNotification);

module.exports = router;
