import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Loading from '../common/Loading';

const AdminDashboard = () => {
  const [analytics, setAnalytics] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await adminAPI.getAnalytics();
      setAnalytics(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading analytics..." />;

  return (
    <div>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{analytics.totalPatients || 0}</span>
          <h3>Total Patients</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{analytics.totalHospitals || 0}</span>
          <h3>Total Hospitals</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{analytics.totalBookings || 0}</span>
          <h3>Total Bookings</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">
            {analytics.bedStatistics ? 
              `${analytics.bedStatistics.availableBeds}/${analytics.bedStatistics.totalBeds}` : 
              '0/0'
            }
          </span>
          <h3>Beds Available</h3>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">{analytics.pendingBookings || 0}</span>
          <h3>Pending Bookings</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{analytics.approvedBookings || 0}</span>
          <h3>Approved Bookings</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{analytics.completedBookings || 0}</span>
          <h3>Completed Bookings</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">
            {analytics.totalBookings ? 
              Math.round(((analytics.completedBookings || 0) / analytics.totalBookings) * 100) : 
              0
            }%
          </span>
          <h3>Completion Rate</h3>
        </div>
      </div>

      <div className="card">
        <h3>System Overview</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginTop: '1rem' }}>
          <div>
            <h4>Booking Status Distribution</h4>
            <div style={{ marginTop: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Pending: {analytics.pendingBookings || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Approved: {analytics.approvedBookings || 0}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span>Completed: {analytics.completedBookings || 0}</span>
              </div>
            </div>
          </div>
          
          <div>
            <h4>Bed Utilization</h4>
            {analytics.bedStatistics && (
              <div style={{ marginTop: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Total Beds: {analytics.bedStatistics.totalBeds}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Available: {analytics.bedStatistics.availableBeds}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span>Occupied: {analytics.bedStatistics.totalBeds - analytics.bedStatistics.availableBeds}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Utilization: 
                    {Math.round(((analytics.bedStatistics.totalBeds - analytics.bedStatistics.availableBeds) / analytics.bedStatistics.totalBeds) * 100)}%
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;