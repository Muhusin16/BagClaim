const express = require('express');
const { uploadBag, searchBags } = require('../controllers/bagController');
const router = express.Router();

router.post('/bags', uploadBag);
router.get('/bags/search', searchBags);

module.exports = router;
