const express = require('express');
const { getAllUsers, getAnalytics } = require('../controllers/adminController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/users', getAllUsers);
router.get('/analytics', getAnalytics);

module.exports = router;