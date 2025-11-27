import React, { useState } from 'react';
import HospitalDashboard from '../components/hospital/Dashboard';
import PatientManagement from '../components/hospital/PatientManagement';
import BedManagement from '../components/hospital/BedManagement';
import Reports from '../components/hospital/Reports'; // Add this import

const HospitalPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', component: <HospitalDashboard /> },
    { id: 'patients', label: 'Patient Management', component: <PatientManagement /> },
    { id: 'beds', label: 'Bed Management', component: <BedManagement /> },
    { id: 'reports', label: 'Medical Reports', component: <Reports /> } // Add this tab
  ];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Hospital Portal</h1>
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

export default HospitalPortal;