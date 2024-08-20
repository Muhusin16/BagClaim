const express = require('express');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const { uploadBag, searchBags, getAllBags, getBagById } = require('../controllers/bagController');
const upload = require('../config/multerConfig');
const router = express.Router();

// Members can report lost and found bags
router.post('/bags', authenticateToken, upload.single('image'), uploadBag);
router.get('/bags/search', authenticateToken, searchBags);
router.get('/bags', authenticateToken, getAllBags);
router.get('/bags/:id', authenticateToken, getBagById);

module.exports = router;