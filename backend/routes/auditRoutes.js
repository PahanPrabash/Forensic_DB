const express = require('express');
const router = express.Router();
const auditController = require('../controllers/auditController');

router.get('/audit-logs', auditController.getAuditLogs);
router.get('/notifications', auditController.getNotifications);

module.exports = router;
