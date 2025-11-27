import React, { useState, useEffect } from 'react';
import { hospitalAPI } from '../../services/api';
import Loading from '../common/Loading';
import { formatDate } from '../../utils';
import PatientReport from './PatientReport';

const PatientManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [showTreatmentModal, setShowTreatmentModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [treatmentData, setTreatmentData] = useState({
    diagnosis: '',
    prescribedMedicines: '',
    consultationNotes: ''
  });
  const [dischargeData, setDischargeData] = useState({
    dischargeSummary: '',
    finalDiagnosis: '',
    medicationsOnDischarge: '',
    followUpInstructions: '',
    consultingPhysician: 'Dr. Rajesh Kumar',
    department: 'Cardiology'
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await hospitalAPI.getBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, status) => {
    try {
      await hospitalAPI.updateBookingStatus(bookingId, status);
      alert(`Booking ${status} successfully`);
      fetchBookings();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating booking status');
    }
  };

  const handleUpdateTreatment = (booking) => {
    setSelectedBooking(booking);
    setTreatmentData({
      diagnosis: booking.treatmentDetails?.diagnosis || '',
      prescribedMedicines: booking.treatmentDetails?.prescribedMedicines?.join(', ') || '',
      consultationNotes: booking.treatmentDetails?.consultationNotes || ''
    });
    setShowTreatmentModal(true);
  };

  const handleDischarge = (booking) => {
    setSelectedBooking(booking);
    setDischargeData({
      dischargeSummary: booking.treatmentDetails?.dischargeSummary || '',
      finalDiagnosis: booking.treatmentDetails?.diagnosis || '',
      medicationsOnDischarge: booking.treatmentDetails?.prescribedMedicines?.join(', ') || '',
      followUpInstructions: booking.treatmentDetails?.followUpInstructions || '',
      consultingPhysician: 'Dr. Rajesh Kumar',
      department: 'Cardiology'
    });
    setShowDischargeModal(true);
  };

  const viewPatientReport = (booking) => {
    setSelectedBooking(booking);
    setShowReport(true);
  };

  const submitTreatment = async (e) => {
    e.preventDefault();
    try {
      await hospitalAPI.updateTreatmentDetails(selectedBooking._id, {
        ...treatmentData,
        prescribedMedicines: treatmentData.prescribedMedicines.split(',').map(m => m.trim())
      });
      alert('Treatment details updated successfully');
      setShowTreatmentModal(false);
      fetchBookings();
    } catch (error) {
      alert('Error updating treatment details');
    }
  };

  const submitDischarge = async (e) => {
    e.preventDefault();
    try {
      await hospitalAPI.dischargePatient(selectedBooking._id, {
        ...dischargeData,
        medicationsOnDischarge: dischargeData.medicationsOnDischarge.split(',').map(m => m.trim())
      });
      alert('Patient discharged successfully and report saved!');
      setShowDischargeModal(false);
      fetchBookings();
    } catch (error) {
      alert('Error discharging patient: ' + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return <Loading message="Loading patients..." />;

  const activeBookings = bookings.filter(b => b.status === 'approved' || b.status === 'pending');

  return (
    <div className="card">
      <h3>Patient Management</h3>
      
      {activeBookings.length === 0 ? (
        <p>No active patients.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Patient Details</th>
              <th>Medical Condition</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeBookings.map(booking => (
              <tr key={booking._id}>
                <td>
                  <div>
                    <strong>{booking.patient?.name}</strong>
                    <br />
                    <small>Age: {booking.patient?.age} | Gender: {booking.patient?.gender}</small>
                    <br />
                    <small>Ayushman: {booking.patient?.ayushmanNumber}</small>
                    <br />
                    <small>Booked: {formatDate(booking.bookingDate)}</small>
                  </div>
                </td>
                <td>{booking.patientDetails?.medicalCondition}</td>
                <td>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {booking.status === 'pending' && (
                      <>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'approved')}
                          className="btn btn-success"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'rejected')}
                          className="btn btn-danger"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          Reject
                        </button>
                      </>
                    )}
                    {booking.status === 'approved' && (
                      <>
                        <button
                          onClick={() => handleUpdateTreatment(booking)}
                          className="btn btn-primary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          Update Treatment
                        </button>
                        <button
                          onClick={() => handleDischarge(booking)}
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                        >
                          Discharge
                        </button>
                      </>
                    )}
                    <button
                      onClick={() => viewPatientReport(booking)}
                      className="btn btn-info"
                      style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                    >
                      📄 View Report
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Treatment Modal */}
      {showTreatmentModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '600px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h3>Update Treatment Details</h3>
            <form onSubmit={submitTreatment}>
              <div className="form-group">
                <label className="form-label">Diagnosis</label>
                <input
                  type="text"
                  value={treatmentData.diagnosis}
                  onChange={(e) => setTreatmentData({ ...treatmentData, diagnosis: e.target.value })}
                  className="form-control"
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Prescribed Medicines (comma separated)</label>
                <input
                  type="text"
                  value={treatmentData.prescribedMedicines}
                  onChange={(e) => setTreatmentData({ ...treatmentData, prescribedMedicines: e.target.value })}
                  className="form-control"
                  placeholder="Paracetamol, Amoxicillin, etc."
                  required
                />
              </div>
              
              <div className="form-group">
                <label className="form-label">Consultation Notes</label>
                <textarea
                  value={treatmentData.consultationNotes}
                  onChange={(e) => setTreatmentData({ ...treatmentData, consultationNotes: e.target.value })}
                  className="form-control"
                  rows="4"
                  required
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowTreatmentModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Update Treatment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Enhanced Discharge Modal */}
      {showDischargeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div className="card" style={{ maxWidth: '700px', width: '90%', maxHeight: '90vh', overflow: 'auto' }}>
            <h3>Discharge Patient & Generate Final Report</h3>
            <form onSubmit={submitDischarge}>
              <div className="form-group">
                <label className="form-label">Final Diagnosis</label>
                <input
                  type="text"
                  value={dischargeData.finalDiagnosis}
                  onChange={(e) => setDischargeData({ ...dischargeData, finalDiagnosis: e.target.value })}
                  className="form-control"
                  required
                  placeholder="Enter final diagnosis"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Medications on Discharge (comma separated)</label>
                <input
                  type="text"
                  value={dischargeData.medicationsOnDischarge}
                  onChange={(e) => setDischargeData({ ...dischargeData, medicationsOnDischarge: e.target.value })}
                  className="form-control"
                  placeholder="Paracetamol, Amoxicillin, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Follow-up Instructions</label>
                <textarea
                  value={dischargeData.followUpInstructions}
                  onChange={(e) => setDischargeData({ ...dischargeData, followUpInstructions: e.target.value })}
                  className="form-control"
                  rows="3"
                  placeholder="Follow-up after 15 days, diet restrictions, etc."
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Discharge Summary</label>
                <textarea
                  value={dischargeData.dischargeSummary}
                  onChange={(e) => setDischargeData({ ...dischargeData, dischargeSummary: e.target.value })}
                  className="form-control"
                  rows="6"
                  required
                  placeholder="Provide detailed discharge summary including treatment given, patient condition at discharge, and recommendations..."
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDischargeModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Discharge Patient & Save Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Patient Report Modal */}
      {showReport && (
        <PatientReport 
          booking={selectedBooking}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
};

export default PatientManagement;