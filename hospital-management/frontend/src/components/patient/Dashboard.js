import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import Loading from '../common/Loading';
import { formatDate } from '../../utils';

const PatientDashboard = () => {
  const [stats, setStats] = useState({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [bookingsResponse] = await Promise.all([
        patientAPI.getMyBookings()
      ]);

      const bookings = bookingsResponse.data;
      
      setStats({
        totalBookings: bookings.length,
        pendingBookings: bookings.filter(b => b.status === 'pending').length,
        approvedBookings: bookings.filter(b => b.status === 'approved').length
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
          <h3>Pending</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{stats.approvedBookings}</span>
          <h3>Approved</h3>
        </div>
      </div>

      <div className="card">
        <h3>Recent Bookings</h3>
        {recentBookings.length === 0 ? (
          <p>No bookings yet. <a href="#search" onClick={() => window.location.href = '/patient#search'}>Search hospitals</a> to book a bed.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Booking Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.hospital?.name}</td>
                  <td>{formatDate(booking.bookingDate)}</td>
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

export default PatientDashboard;