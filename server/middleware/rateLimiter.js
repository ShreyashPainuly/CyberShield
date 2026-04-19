const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Stricter limiter for scan endpoint
const scanLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    success: false,
    message: 'Scan rate limit exceeded. Please wait before scanning more URLs.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

// Auth rate limiter (prevent brute force)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false
});

module.exports = { apiLimiter, scanLimiter, authLimiter };
