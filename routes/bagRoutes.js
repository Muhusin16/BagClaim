const express = require('express');
const { uploadBag, searchBags, getAllBags, getBagById } = require('../controllers/bagController');
const upload = require('../config/multerConfig');
const router = express.Router();

router.post('/bags', upload.single('image'), uploadBag);
router.get('/bags/search', searchBags);
router.get('/bags', getAllBags);
router.get('/bags/:id', getBagById);

module.exports = router;
