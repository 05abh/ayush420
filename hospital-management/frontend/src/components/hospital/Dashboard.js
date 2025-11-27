import React, { useState, useEffect } from 'react';
import { hospitalAPI } from '../../services/api';
import Loading from '../common/Loading';

const HospitalDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    availableBeds: 0,
    totalBeds: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsResponse] = await Promise.all([
        hospitalAPI.getBookings()
      ]);

      const bookings = bookingsResponse.data;
      
      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        approvedBookings: bookings.filter(b => b.status === 'approved').length,
        availableBeds: 0, // This would come from hospital profile
        totalBeds: 0
      });

      setRecentBookings(bookings.slice(0, 5));
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading dashboard..." />;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{stats.totalBookings}</span>
          <h3>Total Bookings</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{stats.pendingBookings}</span>
          <h3>Pending Approval</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{stats.approvedBookings}</span>
          <h3>Active Patients</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{stats.availableBeds}/{stats.totalBeds}</span>
          <h3>Beds Available</h3>
        </div>
      </div>

      <div className="card">
        <h3>Recent Booking Requests</h3>
        {recentBookings.length === 0 ? (
          <p>No booking requests yet.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Patient</th>
                <th>Ayushman Number</th>
                <th>Medical Condition</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking._id}>
                  <td>
                    <div>
                      <strong>{booking.patient?.name}</strong>
                      <br />
                      <small>Age: {booking.patient?.age}, {booking.patient?.gender}</small>
                    </div>
                  </td>
                  <td>{booking.patient?.ayushmanNumber}</td>
                  <td>{booking.patientDetails?.medicalCondition}</td>
                  <td>
                    <span className={`status-badge status-${booking.status}`}>
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default HospitalDashboard;