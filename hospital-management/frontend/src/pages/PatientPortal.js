import React, { useState, useEffect } from 'react';
import PatientDashboard from '../components/patient/Dashboard';
import HospitalSearch from '../components/patient/HospitalSearch';
import Bookings from '../components/patient/Bookings';

const PatientPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', component: <PatientDashboard /> },
    { id: 'search', label: 'Search Hospitals', component: <HospitalSearch /> },
    { id: 'bookings', label: 'My Bookings', component: <Bookings /> }
  ];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Patient Portal</h1>
      </div>

      <div className="auth-tabs">
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`auth-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div>
        {tabs.find(tab => tab.id === activeTab)?.component}
      </div>
    </div>
  );
};

export default PatientPortal;