const express = require('express');
const { searchHospitals, bookBed, getMyBookings } = require('../controllers/patientController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/hospitals', searchHospitals);
router.post('/book-bed', bookBed);
router.get('/my-bookings', getMyBookings);

module.exports = router;