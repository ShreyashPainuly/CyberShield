const express = require('express');
const router = express.Router();
const { getHistory, getStats, deleteScan } = require('../controllers/historyController');
const auth = require('../middleware/auth');

router.get('/', auth, getHistory);
router.get('/stats', auth, getStats);
router.delete('/:id', auth, deleteScan);

module.exports = router;
