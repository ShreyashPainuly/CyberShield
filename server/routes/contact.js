const express = require('express');
const router = express.Router();
const { sendSupportEmail } = require('../controllers/contactController');

// POST /api/contact — Send support email (public route, no auth required)
router.post('/', sendSupportEmail);

module.exports = router;
