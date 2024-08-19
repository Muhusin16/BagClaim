const express = require('express');
const { reportLostBag, getLostBags } = require('../controllers/lostBagController');
const router = express.Router();

router.post('/lost-bags', reportLostBag);
router.get('/lost-bags', getLostBags);

module.exports = router;
