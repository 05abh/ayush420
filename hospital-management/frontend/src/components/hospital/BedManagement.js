import React, { useState, useEffect } from 'react';
import { hospitalAPI } from '../../services/api';
import Loading from '../common/Loading';

const BedManagement = () => {
  const [bedData, setBedData] = useState({
    totalBeds: 0,
    availableBeds: 0
  });
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    // In a real app, you would fetch current bed data from API
    setBedData({
      totalBeds: 100,
      availableBeds: 25
    });
  }, []);

  const handleUpdateBeds = async (e) => {
    e.preventDefault();
    setUpdating(true);
    
    try {
      await hospitalAPI.updateBedAvailability(bedData.availableBeds);
      alert('Bed availability updated successfully');
    } catch (error) {
      alert('Error updating bed availability');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="card">
      <h3>Bed Management</h3>
      
      <div className="stats-grid" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <span className="stat-number">{bedData.totalBeds}</span>
          <h3>Total Beds</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number" style={{ 
            color: bedData.availableBeds > 10 ? '#28a745' : 
                   bedData.availableBeds > 5 ? '#ffc107' : '#dc3545' 
          }}>
            {bedData.availableBeds}
          </span>
          <h3>Available Beds</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">{bedData.totalBeds - bedData.availableBeds}</span>
          <h3>Occupied Beds</h3>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">
            {Math.round((bedData.availableBeds / bedData.totalBeds) * 100)}%
          </span>
          <h3>Availability Rate</h3>
        </div>
      </div>

      <div className="card">
        <h4>Update Bed Availability</h4>
        <form onSubmit={handleUpdateBeds}>
          <div className="form-group">
            <label className="form-label">Total Beds</label>
            <input
              type="number"
              value={bedData.totalBeds}
              onChange={(e) => setBedData({
                ...bedData,
                totalBeds: parseInt(e.target.value)
              })}
              className="form-control"
              min="1"
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Available Beds</label>
            <input
              type="number"
              value={bedData.availableBeds}
              onChange={(e) => setBedData({
                ...bedData,
                availableBeds: parseInt(e.target.value)
              })}
              className="form-control"
              min="0"
              max={bedData.totalBeds}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Bed Availability'}
          </button>
        </form>
      </div>

      <div className="card">
        <h4>Bed Availability Guidelines</h4>
        <ul style={{ textAlign: 'left' }}>
          <li>Update bed counts regularly to ensure accurate availability</li>
          <li>Mark beds as unavailable during maintenance</li>
          <li>Consider reserving some beds for emergency cases</li>
          <li>Update immediately after patient admission or discharge</li>
        </ul>
      </div>
    </div>
  );
};

export default BedManagement;