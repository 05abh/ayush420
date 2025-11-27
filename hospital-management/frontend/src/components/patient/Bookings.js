import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import Loading from '../common/Loading';
import { formatDate } from '../../utils';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await patientAPI.getMyBookings();
      setBookings(response.data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      alert('Error fetching bookings');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading your bookings..." />;

  return (
    <div className="card">
      <h3>My Bookings</h3>
      
      {bookings.length === 0 ? (
        <p>You haven't made any bookings yet.</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Hospital</th>
              <th>Booking Date</th>
              <th>Medical Condition</th>
              <th>Status</th>
              <th>Treatment</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map(booking => (
              <tr key={booking._id}>
                <td>
                  <div>
                    <strong>{booking.hospital?.name}</strong>
                    <br />
                    <small>{booking.hospital?.address}</small>
                    <br />
                    <small>📞 {booking.hospital?.phone}</small>
                  </div>
                </td>
                <td>{formatDate(booking.bookingDate)}</td>
                <td>{booking.patientDetails?.medicalCondition}</td>
                <td>
                  <span className={`status-badge status-${booking.status}`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.treatmentDetails ? (
                    <div>
                      <strong>Diagnosis:</strong> {booking.treatmentDetails.diagnosis}
                      <br />
                      <strong>Medicines:</strong> {booking.treatmentDetails.prescribedMedicines?.join(', ')}
                      {booking.treatmentDetails.dischargeSummary && (
                        <>
                          <br />
                          <strong>Discharged:</strong> {formatDate(booking.treatmentDetails.dischargeDate)}
                        </>
                      )}
                    </div>
                  ) : (
                    'No treatment details yet'
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Bookings;