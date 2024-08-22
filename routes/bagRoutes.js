const express = require('express');
const { uploadBag, searchBags, getAllBags, getBagById, updateBag, deleteBag } = require('../controllers/bagController');
const upload = require('../config/multerConfig');
const router = express.Router();

router.post('/bags', upload.single('image'), uploadBag);
router.get('/bags/search', searchBags);
router.get('/bags', getAllBags);
router.get('/bags/:id', getBagById);
router.put('/bags/:id', updateBag);
router.delete('/bags/:id', deleteBag);

module.exports = router;
