import React, { useState, useEffect } from 'react';
import { patientAPI } from '../../services/api';
import Loading from '../common/Loading';

const HospitalSearch = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchParams, setSearchParams] = useState({
    specialty: '',
    location: ''
  });
  const [bookingData, setBookingData] = useState({
    hospitalId: '',
    medicalCondition: ''
  });
  const [showBookingModal, setShowBookingModal] = useState(false);

  useEffect(() => {
    searchHospitals();
  }, []);

  const searchHospitals = async () => {
    setLoading(true);
    try {
      const response = await patientAPI.searchHospitals(searchParams);
      setHospitals(response.data);
    } catch (error) {
      console.error('Error searching hospitals:', error);
      alert('Error searching hospitals');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchParams({
      ...searchParams,
      [e.target.name]: e.target.value
    });
  };

  const handleBookBed = (hospitalId) => {
    setBookingData({ hospitalId, medicalCondition: '' });
    setShowBookingModal(true);
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    try {
      await patientAPI.bookBed(bookingData);
      alert('Bed booking request submitted successfully! You will receive an email confirmation.');
      setShowBookingModal(false);
      searchHospitals(); // Refresh the list
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking bed');
    }
  };

  return (
    <div>
      <div className="card">
        <h3>Search Hospitals</h3>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Specialty</label>
            <input
              type="text"
              name="specialty"
              value={searchParams.specialty}
              onChange={handleSearchChange}
              className="form-control"
              placeholder="e.g., Cardiology"
            />
          </div>
          
          <div className="form-group" style={{ flex: 1, minWidth: '200px' }}>
            <label className="form-label">Location</label>
            <input
              type="text"
              name="location"
              value={searchParams.location}
              onChange={handleSearchChange}
              className="form-control"
              placeholder="e.g., Mumbai"
            />
          </div>
          
          <div className="form-group" style={{ alignSelf: 'flex-end' }}>
            <button 
              onClick={searchHospitals} 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </div>
      </div>

      {loading ? (
        <Loading message="Searching hospitals..." />
      ) : (
        <div className="card">
          <h3>Available Hospitals ({hospitals.length})</h3>
          
          {hospitals.length === 0 ? (
            <p>No hospitals found matching your criteria.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {hospitals.map(hospital => (
                <div key={hospital._id} className="card" style={{ padding: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <h4 style={{ marginBottom: '0.5rem' }}>{hospital.name}</h4>
                      <p style={{ marginBottom: '0.5rem', color: '#666' }}>{hospital.address}</p>
                      <p style={{ marginBottom: '0.5rem' }}>📞 {hospital.phone}</p>
                      <p style={{ marginBottom: '0.5rem' }}>
                        <strong>Specialties:</strong> {hospital.specialties?.join(', ')}
                      </p>
                    </div>
                    
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: hospital.availableBeds > 0 ? '#28a745' : '#dc3545' }}>
                        {hospital.availableBeds} / {hospital.totalBeds} beds available
                      </div>
                      <button
                        onClick={() => handleBookBed(hospital._id)}
                        className="btn btn-primary"
                        style={{ marginTop: '1rem' }}
                        disabled={hospital.availableBeds === 0}
                      >
                        {hospital.availableBeds > 0 ? 'Book Bed' : 'No Beds Available'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Booking Modal */}
      {showBookingModal && (
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
          <div className="card" style={{ maxWidth: '500px', width: '90%' }}>
            <h3>Book Bed</h3>
            <form onSubmit={handleBookingSubmit}>
              <div className="form-group">
                <label className="form-label">Medical Condition</label>
                <textarea
                  name="medicalCondition"
                  value={bookingData.medicalCondition}
                  onChange={(e) => setBookingData({
                    ...bookingData,
                    medicalCondition: e.target.value
                  })}
                  className="form-control"
                  rows="4"
                  required
                  placeholder="Describe your medical condition..."
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowBookingModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Booking
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HospitalSearch;