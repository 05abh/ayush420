const express = require('express');
const { 
  getHospitalBookings, 
  updateBookingStatus, 
  updateBedAvailability,
  updateTreatmentDetails,
  dischargePatient
} = require('../controllers/hospitalController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);
router.get('/bookings', getHospitalBookings);
router.put('/booking/:bookingId/status', updateBookingStatus);
router.put('/beds', updateBedAvailability);
router.put('/booking/:bookingId/treatment', updateTreatmentDetails);
router.put('/booking/:bookingId/discharge', dischargePatient);

module.exports = router;