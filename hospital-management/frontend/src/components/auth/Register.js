import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/auth';
import Loading from '../common/Loading';

const Register = () => {
  const [activeTab, setActiveTab] = useState('patient');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [patientData, setPatientData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    ayushmanNumber: '',
    age: '',
    gender: '',
    address: ''
  });

  const [hospitalData, setHospitalData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    phone: '',
    totalBeds: '',
    specialties: ''
  });

  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePatientChange = (e) => {
    setPatientData({
      ...patientData,
      [e.target.name]: e.target.value
    });
  };

  const handleHospitalChange = (e) => {
    setHospitalData({
      ...hospitalData,
      [e.target.name]: e.target.value
    });
  };

  const handlePatientSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.registerPatient({
        ...patientData,
        age: parseInt(patientData.age)
      });
      login(userData);
      navigate('/patient');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleHospitalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = await authService.registerHospital({
        ...hospitalData,
        totalBeds: parseInt(hospitalData.totalBeds),
        specialties: hospitalData.specialties.split(',').map(s => s.trim())
      });
      login(userData);
      navigate('/hospital');
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Registering..." />;

  return (
    <div className="auth-container">
      <div className="card">
        <h2>Create Account</h2>
        
        <div className="auth-tabs">
          <button 
            className={`auth-tab ${activeTab === 'patient' ? 'active' : ''}`}
            onClick={() => setActiveTab('patient')}
          >
            Patient
          </button>
          <button 
            className={`auth-tab ${activeTab === 'hospital' ? 'active' : ''}`}
            onClick={() => setActiveTab('hospital')}
          >
            Hospital
          </button>
        </div>

        {error && <div style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}

        {activeTab === 'patient' && (
          <form onSubmit={handlePatientSubmit}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                value={patientData.name}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={patientData.email}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={patientData.password}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={patientData.phone}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Ayushman Card Number</label>
              <input
                type="text"
                name="ayushmanNumber"
                value={patientData.ayushmanNumber}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Age</label>
              <input
                type="number"
                name="age"
                value={patientData.age}
                onChange={handlePatientChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Gender</label>
              <select
                name="gender"
                value={patientData.gender}
                onChange={handlePatientChange}
                className="form-control"
                required
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={patientData.address}
                onChange={handlePatientChange}
                className="form-control"
                rows="3"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Register as Patient
            </button>
          </form>
        )}

        {activeTab === 'hospital' && (
          <form onSubmit={handleHospitalSubmit}>
            <div className="form-group">
              <label className="form-label">Hospital Name</label>
              <input
                type="text"
                name="name"
                value={hospitalData.name}
                onChange={handleHospitalChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                type="email"
                name="email"
                value={hospitalData.email}
                onChange={handleHospitalChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                value={hospitalData.password}
                onChange={handleHospitalChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                value={hospitalData.address}
                onChange={handleHospitalChange}
                className="form-control"
                rows="3"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Phone</label>
              <input
                type="tel"
                name="phone"
                value={hospitalData.phone}
                onChange={handleHospitalChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Beds</label>
              <input
                type="number"
                name="totalBeds"
                value={hospitalData.totalBeds}
                onChange={handleHospitalChange}
                className="form-control"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Specialties (comma separated)</label>
              <input
                type="text"
                name="specialties"
                value={hospitalData.specialties}
                onChange={handleHospitalChange}
                className="form-control"
                placeholder="Cardiology, Neurology, Orthopedics"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Register as Hospital
            </button>
          </form>
        )}

        <p style={{ marginTop: '1rem', textAlign: 'center' }}>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;