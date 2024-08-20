const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware'); // Ensure this path is correct
const { updateBag, deleteBag } = require('../controllers/bagController');
const router = express.Router();

// Admins can update and delete bags
router.put('/bags/:id', authenticateToken, authorizeRole(['admin']), updateBag);
router.delete('/bags/:id', authenticateToken, authorizeRole(['admin']), deleteBag);

module.exports = router;
