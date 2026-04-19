const express = require('express');
const router = express.Router();
const { scanUrl, getScan } = require('../controllers/scanController');
const auth = require('../middleware/auth');
const { scanLimiter } = require('../middleware/rateLimiter');

router.post('/', auth, scanLimiter, scanUrl);
router.get('/:id', auth, getScan);

module.exports = router;
