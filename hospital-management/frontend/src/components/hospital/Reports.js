import React, { useState, useEffect } from 'react';
import { reportAPI } from '../../services/api';
import Loading from '../common/Loading';
import { formatDate } from '../../utils';

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReportModal, setShowReportModal] = useState(false);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      const response = await reportAPI.getHospitalReports();
      setReports(response.data);
    } catch (error) {
      console.error('Error fetching reports:', error);
      alert('Error fetching medical reports');
    } finally {
      setLoading(false);
    }
  };

  const viewFullReport = (report) => {
    setSelectedReport(report);
    setShowReportModal(true);
  };

  const printReport = (report) => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Medical Report - ${report.patientDetails?.name}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .section { margin-bottom: 20px; }
            .section-title { background: #f5f5f5; padding: 8px; font-weight: bold; }
            .patient-info, .treatment-info { width: 100%; border-collapse: collapse; margin: 10px 0; }
            .patient-info td, .treatment-info td { padding: 8px; border: 1px solid #ddd; }
            .footer { margin-top: 30px; text-align: right; font-style: italic; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>MEDICAL REPORT</h1>
            <h3>${report.patientDetails?.name} - ${report.reportId}</h3>
            <p>Report Date: ${formatDate(report.reportDate)}</p>
          </div>

          <div class="section">
            <div class="section-title">PATIENT INFORMATION</div>
            <table class="patient-info">
              <tr><td><strong>Name:</strong></td><td>${report.patientDetails?.name}</td></tr>
              <tr><td><strong>Age/Gender:</strong></td><td>${report.patientDetails?.age} years / ${report.patientDetails?.gender}</td></tr>
              <tr><td><strong>Ayushman ID:</strong></td><td>${report.patientDetails?.ayushmanNumber}</td></tr>
              <tr><td><strong>Contact:</strong></td><td>${report.patientDetails?.phone}</td></tr>
              <tr><td><strong>Admission Date:</strong></td><td>${formatDate(report.admissionDate)}</td></tr>
              <tr><td><strong>Discharge Date:</strong></td><td>${formatDate(report.dischargeDate)}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">MEDICAL INFORMATION</div>
            <table class="treatment-info">
              <tr><td><strong>Chief Complaint:</strong></td><td>${report.chiefComplaint || 'Not specified'}</td></tr>
              <tr><td><strong>Diagnosis:</strong></td><td>${report.diagnosis || 'Not specified'}</td></tr>
              <tr><td><strong>Final Diagnosis:</strong></td><td>${report.finalDiagnosis || 'Not specified'}</td></tr>
              <tr><td><strong>Consulting Physician:</strong></td><td>${report.consultingPhysician}</td></tr>
              <tr><td><strong>Department:</strong></td><td>${report.department}</td></tr>
            </table>
          </div>

          <div class="section">
            <div class="section-title">TREATMENT & MEDICATIONS</div>
            <p><strong>Prescribed Medicines:</strong></p>
            <ul>
              ${report.prescribedMedicines?.map(med => `<li>${med}</li>`).join('') || '<li>No medications prescribed</li>'}
            </ul>
            <p><strong>Consultation Notes:</strong></p>
            <p>${report.consultationNotes || 'No consultation notes available'}</p>
          </div>

          ${report.dischargeSummary ? `
          <div class="section">
            <div class="section-title">DISCHARGE SUMMARY</div>
            <p><strong>Condition at Discharge:</strong> ${report.conditionAtDischarge || 'Stable'}</p>
            <p><strong>Discharge Summary:</strong></p>
            <p>${report.dischargeSummary}</p>
            ${report.followUpInstructions ? `
            <p><strong>Follow-up Instructions:</strong></p>
            <p>${report.followUpInstructions}</p>
            ` : ''}
            ${report.medicationsOnDischarge?.length > 0 ? `
            <p><strong>Medications on Discharge:</strong></p>
            <ul>
              ${report.medicationsOnDischarge.map(med => `<li>${med}</li>`).join('')}
            </ul>
            ` : ''}
          </div>
          ` : ''}

          <div class="footer">
            <p>Generated on: ${new Date().toLocaleDateString()}</p>
            <p>Authorized Signature: ___________________</p>
            <p>${report.consultingPhysician}</p>
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) return <Loading message="Loading medical reports..." />;

  return (
    <div className="card">
      <div className="dashboard-header">
        <h3>Medical Reports</h3>
        <p>View all discharged patient medical reports</p>
      </div>

      {reports.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <h4>No Medical Reports Yet</h4>
          <p>Discharge patients to generate medical reports</p>
          <p style={{ color: '#666', fontSize: '14px' }}>
            Medical reports are automatically created when you discharge patients from the Patient Management section.
          </p>
        </div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-number">{reports.length}</span>
              <h3>Total Reports</h3>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {reports.filter(r => r.reportType === 'discharge').length}
              </span>
              <h3>Discharge Reports</h3>
            </div>
            <div className="stat-card">
              <span className="stat-number">
                {reports.filter(r => r.reportType === 'consultation').length}
              </span>
              <h3>Consultation Reports</h3>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Report ID</th>
                <th>Patient Details</th>
                <th>Report Type</th>
                <th>Medical Information</th>
                <th>Dates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report._id}>
                  <td>
                    <strong>{report.reportId || 'N/A'}</strong>
                  </td>
                  <td>
                    <div>
                      <strong>{report.patientDetails?.name}</strong>
                      <br />
                      <small>Age: {report.patientDetails?.age} | {report.patientDetails?.gender}</small>
                      <br />
                      <small>Ayushman: {report.patientDetails?.ayushmanNumber}</small>
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge status-${report.reportType}`}>
                      {report.reportType}
                    </span>
                  </td>
                  <td>
                    <div>
                      <strong>Diagnosis:</strong> {report.finalDiagnosis || report.diagnosis || 'Not specified'}
                      <br />
                      <strong>Physician:</strong> {report.consultingPhysician}
                      <br />
                      <strong>Dept:</strong> {report.department}
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>Admission:</strong> {formatDate(report.admissionDate)}
                      <br />
                      <strong>Discharge:</strong> {formatDate(report.dischargeDate)}
                      <br />
                      <strong>Report:</strong> {formatDate(report.reportDate)}
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <button
                        onClick={() => viewFullReport(report)}
                        className="btn btn-info"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                      >
                        👁️ View
                      </button>
                      <button
                        onClick={() => printReport(report)}
                        className="btn btn-primary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.875rem' }}
                      >
                        🖨️ Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      {/* Report Details Modal */}
      {showReportModal && selectedReport && (
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
            maxWidth: '900px',
            width: '100%',
            maxHeight: '90vh',
            overflow: 'auto',
            fontFamily: 'Arial, sans-serif'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h3>Medical Report - {selectedReport.reportId}</h3>
              <button
                onClick={() => setShowReportModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: '#f0f0f0',
                padding: '8px 12px',
                fontWeight: 'bold',
                borderLeft: '4px solid #007bff',
                marginBottom: '10px'
              }}>
                PATIENT INFORMATION
              </div>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <tbody>
                  <tr><td style={{ padding: '8px', border: '1px solid #ddd', width: '30%', fontWeight: 'bold' }}>Name:</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>{selectedReport.patientDetails?.name}</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Age/Gender:</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>{selectedReport.patientDetails?.age} years / {selectedReport.patientDetails?.gender}</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Ayushman Card:</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>{selectedReport.patientDetails?.ayushmanNumber}</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Contact:</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>{selectedReport.patientDetails?.phone}</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Admission Date:</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(selectedReport.admissionDate)}</td></tr>
                  <tr><td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold' }}>Discharge Date:</td><td style={{ padding: '8px', border: '1px solid #ddd' }}>{formatDate(selectedReport.dischargeDate)}</td></tr>
                </tbody>
              </table>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <div style={{
                background: '#f0f0f0',
                padding: '8px 12px',
                fontWeight: 'bold',
                borderLeft: '4px solid #007bff',
                marginBottom: '10px'
              }}>
                MEDICAL INFORMATION
              </div>
              <p><strong>Chief Complaint:</strong> {selectedReport.chiefComplaint || 'Not specified'}</p>
              <p><strong>Diagnosis:</strong> {selectedReport.diagnosis || 'Not specified'}</p>
              <p><strong>Final Diagnosis:</strong> {selectedReport.finalDiagnosis || 'Not specified'}</p>
              <p><strong>Consulting Physician:</strong> {selectedReport.consultingPhysician}</p>
              <p><strong>Department:</strong> {selectedReport.department}</p>
            </div>

            {selectedReport.dischargeSummary && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{
                  background: '#f0f0f0',
                  padding: '8px 12px',
                  fontWeight: 'bold',
                  borderLeft: '4px solid #28a745',
                  marginBottom: '10px'
                }}>
                  DISCHARGE SUMMARY
                </div>
                <p><strong>Condition at Discharge:</strong> {selectedReport.conditionAtDischarge || 'Stable'}</p>
                <p><strong>Discharge Summary:</strong></p>
                <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '5px' }}>
                  {selectedReport.dischargeSummary}
                </div>
                {selectedReport.followUpInstructions && (
                  <>
                    <p><strong>Follow-up Instructions:</strong></p>
                    <div style={{ padding: '10px', background: '#f9f9f9', borderRadius: '5px' }}>
                      {selectedReport.followUpInstructions}
                    </div>
                  </>
                )}
              </div>
            )}

            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button
                onClick={() => printReport(selectedReport)}
                className="btn btn-primary"
                style={{ marginRight: '10px' }}
              >
                🖨️ Print Report
              </button>
              <button
                onClick={() => setShowReportModal(false)}
                className="btn btn-secondary"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reports;