const mongoose = require('mongoose');

const medicalReportSchema = new mongoose.Schema({
  // Reference Fields
  booking: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Booking',
    required: true
  },
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
  
  // Report Identification
  reportId: {
    type: String,
    unique: true
    // Remove required: true to make it optional, it will be auto-generated
  },
  reportType: {
    type: String,
    enum: ['discharge', 'consultation', 'lab', 'followup'],
    default: 'discharge'
  },
  
  // Patient Information
  patientDetails: {
    name: String,
    age: Number,
    gender: String,
    ayushmanNumber: String,
    phone: String,
    address: String
  },
  
  // Medical Information
  chiefComplaint: String,
  diagnosis: String,
  finalDiagnosis: String,
  prescribedMedicines: [String],
  consultationNotes: String,
  
  // Discharge Specific
  dischargeSummary: String,
  medicationsOnDischarge: [String],
  followUpInstructions: String,
  conditionAtDischarge: String,
  
  // Medical Team
  consultingPhysician: String,
  department: String,
  
  // Dates
  admissionDate: Date,
  dischargeDate: Date,
  reportDate: {
    type: Date,
    default: Date.now
  },
  
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    refPath: 'generatedByModel'
  },
  generatedByModel: {
    type: String,
    enum: ['Hospital', 'Admin']
  }
}, {
  timestamps: true
});

// Generate unique report ID before saving - FIXED VERSION
medicalReportSchema.pre('save', function(next) {
  if (!this.reportId) {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 9); // Increased length
    this.reportId = `MR-${timestamp}-${random}`.toUpperCase();
  }
  next();
});

module.exports = mongoose.model('MedicalReport', medicalReportSchema);