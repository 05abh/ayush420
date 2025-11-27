import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/api';
import Loading from '../common/Loading';
import { formatDate } from '../../utils';

const UserManagement = () => {
  const [users, setUsers] = useState({ patients: [], hospitals: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('patients');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminAPI.getUsers();
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error fetching users');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Loading users..." />;

  return (
    <div className="card">
      <div className="auth-tabs">
        <button 
          className={`auth-tab ${activeTab === 'patients' ? 'active' : ''}`}
          onClick={() => setActiveTab('patients')}
        >
          Patients ({users.patients.length})
        </button>
        <button 
          className={`auth-tab ${activeTab === 'hospitals' ? 'active' : ''}`}
          onClick={() => setActiveTab('hospitals')}
        >
          Hospitals ({users.hospitals.length})
        </button>
      </div>

      {activeTab === 'patients' && (
        <div>
          <h3>Patient Management</h3>
          {users.patients.length === 0 ? (
            <p>No patients registered yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Ayushman Number</th>
                  <th>Age/Gender</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.patients.map(patient => (
                  <tr key={patient._id}>
                    <td>
                      <strong>{patient.name}</strong>
                      <br />
                      <small>{patient.address}</small>
                    </td>
                    <td>{patient.email}</td>
                    <td>{patient.phone}</td>
                    <td>{patient.ayushmanNumber}</td>
                    <td>{patient.age} / {patient.gender}</td>
                    <td>{formatDate(patient.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {activeTab === 'hospitals' && (
        <div>
          <h3>Hospital Management</h3>
          {users.hospitals.length === 0 ? (
            <p>No hospitals registered yet.</p>
          ) : (
            <table className="table">
              <thead>
                <tr>
                  <th>Hospital Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Address</th>
                  <th>Specialties</th>
                  <th>Beds</th>
                  <th>Registered</th>
                </tr>
              </thead>
              <tbody>
                {users.hospitals.map(hospital => (
                  <tr key={hospital._id}>
                    <td>
                      <strong>{hospital.name}</strong>
                    </td>
                    <td>{hospital.email}</td>
                    <td>{hospital.phone}</td>
                    <td>{hospital.address}</td>
                    <td>{hospital.specialties?.join(', ')}</td>
                    <td>
                      {hospital.availableBeds}/{hospital.totalBeds} available
                    </td>
                    <td>{formatDate(hospital.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default UserManagement;