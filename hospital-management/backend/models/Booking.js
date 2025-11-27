const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true
  },
  hospital: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Hospital',
    required: true
  },
  bookingDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'completed'],
    default: 'pending'
  },
  patientDetails: {
    name: String,
    age: Number,
    gender: String,
    ayushmanNumber: String,
    medicalCondition: String
  },
  treatmentDetails: {
    diagnosis: String,
    prescribedMedicines: [String],
    consultationNotes: String,
    dischargeSummary: String,
    dischargeDate: Date
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);