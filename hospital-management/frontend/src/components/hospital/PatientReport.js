import React from 'react';
import { formatDate } from '../../utils';

const PatientReport = ({ booking, onClose }) => {
  if (!booking) return null;

  // Safe data access with fallbacks
  const patient = booking.patient || {};
  const hospital = booking.hospital || {};
  const patientDetails = booking.patientDetails || {};
  const treatmentDetails = booking.treatmentDetails || {};

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflow: 'auto',
        fontFamily: 'Arial, sans-serif'
      }}>
        {/* Header */}
        <div style={{
          textAlign: 'center',
          borderBottom: '3px double #333',
          paddingBottom: '15px',
          marginBottom: '20px'
        }}>
          <h1 style={{ margin: '0 0 10px 0', fontSize: '28px', color: '#333' }}>MEDICAL REPORT</h1>
          <h2 style={{ margin: '0 0 5px 0', fontSize: '20px', color: '#555' }}>{hospital.name || 'Hospital Name Not Available'}</h2>
          <p style={{ margin: '2px 0', color: '#666' }}>{hospital.address || 'Address Not Available'}</p>
          <p style={{ margin: '2px 0', color: '#666' }}>Phone: {hospital.phone || 'Phone Not Available'}</p>
        </div>

        {/* Patient Information */}
        <div style={{ margin: '20px 0' }}>
          <div style={{
            background: '#f0f0f0',
            padding: '8px 12px',
            fontWeight: 'bold',
            borderLeft: '4px solid #007bff',
            marginBottom: '10px'
          }}>
            PATIENT INFORMATION
          </div>
          <table style={{ width: '100%', borderCollapse: 'collapse', margin: '10px 0' }}>
            <tbody>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', width: '30%', fontWeight: 'bold' }}>Name:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd', width: '70%' }}>{patient.name || 'Not Available'}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Age/Gender:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{patient.age || 'N/A'} years / {patient.gender || 'Not Available'}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Ayushman Card:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{patient.ayushmanNumber || 'Not Available'}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Contact:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{patient.phone || 'Not Available'}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Admission Date:</td>
                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{booking.bookingDate ? formatDate(booking.bookingDate) : 'Not Available'}</td>
              </tr>
              {treatmentDetails.dischargeDate && (
                <tr>
                  <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Discharge Date:</td>
                  <td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(treatmentDetails.dischargeDate)}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Medical Condition */}
        <div style={{ margin: '20px 0' }}>
          <div style={{
            background: '#f0f0f0',
            padding: '8px 12px',
            fontWeight: 'bold',
            borderLeft: '4px solid #007bff',
            marginBottom: '10px'
          }}>
            MEDICAL HISTORY & PRESENTING COMPLAINT
          </div>
          <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
            <strong>Chief Complaint:</strong> {patientDetails.medicalCondition || 'Not specified'}
          </div>
        </div>

        {/* Diagnosis */}
        <div style={{ margin: '20px 0' }}>
          <div style={{
            background: '#f0f0f0',
            padding: '8px 12px',
            fontWeight: 'bold',
            borderLeft: '4px solid #007bff',
            marginBottom: '10px'
          }}>
            DIAGNOSIS
          </div>
          <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
            <strong>Primary Diagnosis:</strong> {treatmentDetails.diagnosis || treatmentDetails.finalDiagnosis || 'Not specified'}
          </div>
        </div>

        {/* Treatment Provided */}
        <div style={{ margin: '20px 0' }}>
          <div style={{
            background: '#f0f0f0',
            padding: '8px 12px',
            fontWeight: 'bold',
            borderLeft: '4px solid #007bff',
            marginBottom: '10px'
          }}>
            TREATMENT PROVIDED
          </div>
          
          <div style={{ marginBottom: '15px' }}>
            <strong>Medications Prescribed:</strong>
            {(treatmentDetails.prescribedMedicines && treatmentDetails.prescribedMedicines.length > 0) || 
             (treatmentDetails.medicationsOnDischarge && treatmentDetails.medicationsOnDischarge.length > 0) ? (
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                {(treatmentDetails.medicationsOnDischarge || treatmentDetails.prescribedMedicines || []).map((medicine, index) => (
                  <li key={index}>{medicine}</li>
                ))}
              </ul>
            ) : (
              <p style={{ margin: '8px 0', color: '#666' }}>No medications prescribed</p>
            )}
          </div>

          <div>
            <strong>Consultation Notes:</strong>
            <div style={{ 
              padding: '10px', 
              background: '#f9f9f9', 
              borderRadius: '5px', 
              marginTop: '8px',
              minHeight: '60px'
            }}>
              {treatmentDetails.consultationNotes || 'No consultation notes available'}
            </div>
          </div>
        </div>

        {/* Discharge Summary */}
        {treatmentDetails.dischargeSummary && (
          <div style={{ margin: '20px 0' }}>
            <div style={{
              background: '#f0f0f0',
              padding: '8px 12px',
              fontWeight: 'bold',
              borderLeft: '4px solid #007bff',
              marginBottom: '10px'
            }}>
              DISCHARGE SUMMARY
            </div>
            
            {/* Final Diagnosis */}
            {treatmentDetails.finalDiagnosis && (
              <div style={{ marginBottom: '15px' }}>
                <strong>Final Diagnosis:</strong>
                <div style={{ padding: '8px', background: '#f9f9f9', borderRadius: '5px', marginTop: '5px' }}>
                  {treatmentDetails.finalDiagnosis}
                </div>
              </div>
            )}

            {/* Medications on Discharge */}
            {treatmentDetails.medicationsOnDischarge && treatmentDetails.medicationsOnDischarge.length > 0 && (
              <div style={{ marginBottom: '15px' }}>
                <strong>Medications on Discharge:</strong>
                <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                  {treatmentDetails.medicationsOnDischarge.map((medicine, index) => (
                    <li key={index}>{medicine}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Follow-up Instructions */}
            {treatmentDetails.followUpInstructions && (
              <div style={{ marginBottom: '15px' }}>
                <strong>Follow-up Instructions:</strong>
                <div style={{ padding: '8px', background: '#f9f9f9', borderRadius: '5px', marginTop: '5px' }}>
                  {treatmentDetails.followUpInstructions}
                </div>
              </div>
            )}

            {/* Discharge Summary */}
            <div style={{ 
              padding: '15px', 
              background: '#f9f9f9', 
              borderRadius: '5px',
              borderLeft: '4px solid #28a745'
            }}>
              {treatmentDetails.dischargeSummary}
            </div>
          </div>
        )}

        {/* Footer & Signatures */}
        <div style={{ 
          marginTop: '40px', 
          borderTop: '1px solid #333', 
          paddingTop: '20px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '30px' }}>
            <p style={{ margin: '5px 0' }}><strong>Consulting Physician:</strong> {treatmentDetails.consultingPhysician || 'Dr. Rajesh Kumar'}</p>
            <p style={{ margin: '5px 0' }}><strong>Department:</strong> {treatmentDetails.department || 'Cardiology'}</p>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: '5px 0' }}>Date: {new Date().toLocaleDateString()}</p>
              <p style={{ margin: '5px 0' }}>Hospital Stamp: [ ]</p>
            </div>
            
            <div style={{ textAlign: 'center' }}>
              <p style={{ margin: '20px 0 5px 0' }}>_________________________</p>
              <p style={{ margin: '5px 0' }}>{treatmentDetails.consultingPhysician || 'Dr. Rajesh Kumar'}</p>
              <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>Consultant Physician</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ textAlign: 'center', marginTop: '30px' }}>
          <button
            onClick={() => window.print()}
            className="btn btn-primary"
            style={{ marginRight: '10px' }}
          >
            🖨️ Print Report
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientReport;