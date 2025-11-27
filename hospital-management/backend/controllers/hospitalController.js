const Booking = require('../models/Booking');
const Hospital = require('../models/Hospital');
const MedicalReport = require('../models/MedicalReport');
const sendEmail = require('../config/email');

exports.getHospitalBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ hospital: req.user._id })
      .populate('patient', 'name age gender ayushmanNumber phone')
      .populate('hospital', 'name address phone availableBeds totalBeds')
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId).populate('patient hospital');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (status === 'approved') {
      const hospital = await Hospital.findById(req.user._id);
      if (hospital.availableBeds <= 0) {
        return res.status(400).json({ message: 'No beds available' });
      }
      hospital.availableBeds -= 1;
      await hospital.save();
    }

    booking.status = status;
    await booking.save();

    const statusText = status === 'approved' ? 'approved' : 'rejected';
    const emailText = `Dear ${booking.patient.name},\n\nYour bed booking request at ${booking.hospital.name} has been ${statusText}.\nBooking ID: ${booking._id}\n\nThank you`;
    await sendEmail(booking.patient.email, `Bed Booking ${statusText}`, emailText);

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateBedAvailability = async (req, res) => {
  try {
    const { availableBeds } = req.body;
    const hospital = await Hospital.findById(req.user._id);
    hospital.availableBeds = availableBeds;
    await hospital.save();
    res.json(hospital);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateTreatmentDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { diagnosis, prescribedMedicines, consultationNotes } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.treatmentDetails = {
      diagnosis,
      prescribedMedicines,
      consultationNotes,
      ...booking.treatmentDetails
    };
    await booking.save();

    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.dischargePatient = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { 
      dischargeSummary, 
      finalDiagnosis, 
      medicationsOnDischarge, 
      followUpInstructions,
      consultingPhysician,
      department 
    } = req.body;

    const booking = await Booking.findById(bookingId)
      .populate('patient')
      .populate('hospital');

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const medicalReport = await MedicalReport.create({
      booking: bookingId,
      patient: booking.patient._id,
      hospital: booking.hospital._id,
      reportType: 'discharge',
      patientDetails: {
        name: booking.patient.name,
        age: booking.patient.age,
        gender: booking.patient.gender,
        ayushmanNumber: booking.patient.ayushmanNumber,
        phone: booking.patient.phone,
        address: booking.patient.address
      },
      chiefComplaint: booking.patientDetails?.medicalCondition,
      diagnosis: booking.treatmentDetails?.diagnosis,
      finalDiagnosis: finalDiagnosis || booking.treatmentDetails?.diagnosis,
      prescribedMedicines: booking.treatmentDetails?.prescribedMedicines || [],
      consultationNotes: booking.treatmentDetails?.consultationNotes,
      dischargeSummary: dischargeSummary,
      medicationsOnDischarge: Array.isArray(medicationsOnDischarge) ? medicationsOnDischarge : [],
      followUpInstructions: followUpInstructions || '',
      conditionAtDischarge: 'Stable',
      consultingPhysician: consultingPhysician || 'Dr. Rajesh Kumar',
      department: department || 'General Medicine',
      admissionDate: booking.bookingDate,
      dischargeDate: new Date(),
      reportDate: new Date(),
      generatedBy: req.user._id,
      generatedByModel: 'Hospital'
    });

    booking.status = 'completed';
    booking.treatmentDetails = {
      ...booking.treatmentDetails,
      dischargeSummary,
      dischargeDate: new Date()
    };
    await booking.save();

    const hospital = await Hospital.findById(booking.hospital._id);
    hospital.availableBeds += 1;
    await hospital.save();

    console.log('✅ Patient discharged and medical report created:', medicalReport.reportId);
    
    res.json({
      message: 'Patient discharged and medical report generated successfully',
      booking: booking,
      medicalReport: medicalReport
    });

  } catch (error) {
    console.error('❌ Error discharging patient:', error);
    res.status(400).json({ message: error.message });
  }
};