const MedicalReport = require('../models/MedicalReport');

// Get All Reports for a Hospital
exports.getHospitalReports = async (req, res) => {
  try {
    const reports = await MedicalReport.find({ hospital: req.user._id })
      .populate('patient', 'name age gender ayushmanNumber')
      .populate('booking')
      .sort({ createdAt: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get All Reports for a Patient
exports.getPatientReports = async (req, res) => {
  try {
    const { patientId } = req.params;
    
    const reports = await MedicalReport.find({ patient: patientId })
      .populate('hospital', 'name address phone')
      .populate('booking')
      .sort({ reportDate: -1 });
    
    res.json(reports);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get Single Report
exports.getReportById = async (req, res) => {
  try {
    const { reportId } = req.params;
    
    const report = await MedicalReport.findById(reportId)
      .populate('patient', 'name age gender ayushmanNumber phone address')
      .populate('hospital', 'name address phone specialties')
      .populate('booking');
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};