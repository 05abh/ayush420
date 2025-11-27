const Booking = require('../models/Booking');
const Hospital = require('../models/Hospital');
const sendEmail = require('../config/email');

// Search Hospitals
exports.searchHospitals = async (req, res) => {
  try {
    const { specialty, location } = req.query;
    let query = { isAyushmanEmpaneled: true };

    if (specialty) {
      query.specialties = { $in: [new RegExp(specialty, 'i')] };
    }
    if (location) {
      query.address = new RegExp(location, 'i');
    }

    const hospitals = await Hospital.find(query).select('-password');
    res.json(hospitals);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Book Bed
exports.bookBed = async (req, res) => {
  try {
    const { hospitalId, medicalCondition } = req.body;
    const patientId = req.user._id;

    const hospital = await Hospital.findById(hospitalId);
    if (!hospital) {
      return res.status(404).json({ message: 'Hospital not found' });
    }

    if (hospital.availableBeds <= 0) {
      return res.status(400).json({ message: 'No beds available' });
    }

    const booking = await Booking.create({
      patient: patientId,
      hospital: hospitalId,
      patientDetails: {
        name: req.user.name,
        age: req.user.age,
        gender: req.user.gender,
        ayushmanNumber: req.user.ayushmanNumber,
        medicalCondition
      }
    });

    // Send email notification
    const emailText = `Dear ${req.user.name},\n\nYour bed booking request at ${hospital.name} has been submitted successfully.\nBooking ID: ${booking._id}\nStatus: Pending Approval\n\nWe will notify you once the hospital reviews your request.\n\nThank you`;
    await sendEmail(req.user.email, 'Bed Booking Request Submitted', emailText);

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Patient Bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ patient: req.user._id })
      .populate('hospital', 'name address phone')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};