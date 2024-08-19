const express = require('express');
const { reclaimBag, requestAdditionalInfo, verifyReclaim } = require('../controllers/reclaimController');
const router = express.Router();

// Route to create a reclaim request
router.post('/bags/:id/reclaim', reclaimBag);

// Route for the finder to request additional information
router.put('/bags/:id/reclaim/:reclaimId/request-info', requestAdditionalInfo);

// Route for the finder to verify or reject a reclaim request
router.put('/bags/:id/reclaim/:reclaimId/verify', verifyReclaim);

module.exports = router;
