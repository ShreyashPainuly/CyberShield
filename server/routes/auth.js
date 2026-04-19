const express = require('express');
const router = express.Router();
const { register, login, getMe, updateProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validate('register'), register);
router.post('/login', authLimiter, validate('login'), login);
router.get('/me', auth, getMe);
router.put('/profile', auth, updateProfile);

module.exports = router;
