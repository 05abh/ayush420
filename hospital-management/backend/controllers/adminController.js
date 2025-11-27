const Patient = require('../models/Patient');
const Hospital = require('../models/Hospital');
const Booking = require('../models/Booking');

// Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const patients = await Patient.find().select('-password');
    const hospitals = await Hospital.find().select('-password');
    
    res.json({
      patients,
      hospitals
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Analytics
exports.getAnalytics = async (req, res) => {
  try {
    const totalPatients = await Patient.countDocuments();
    const totalHospitals = await Hospital.countDocuments();
    const totalBookings = await Booking.countDocuments();
    const pendingBookings = await Booking.countDocuments({ status: 'pending' });
    const approvedBookings = await Booking.countDocuments({ status: 'approved' });
    const completedBookings = await Booking.countDocuments({ status: 'completed' });

    const bedStatistics = await Hospital.aggregate([
      {
        $group: {
          _id: null,
          totalBeds: { $sum: '$totalBeds' },
          availableBeds: { $sum: '$availableBeds' }
        }
      }
    ]);

    res.json({
      totalPatients,
      totalHospitals,
      totalBookings,
      pendingBookings,
      approvedBookings,
      completedBookings,
      bedStatistics: bedStatistics[0] || { totalBeds: 0, availableBeds: 0 }
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};