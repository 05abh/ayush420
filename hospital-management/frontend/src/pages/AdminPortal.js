import React, { useState } from 'react';
import AdminDashboard from '../components/admin/Dashboard';
import UserManagement from '../components/admin/UserManagement';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', component: <AdminDashboard /> },
    { id: 'users', label: 'User Management', component: <UserManagement /> }
  ];

  return (
    <div>
      <div className="dashboard-header">
        <h1>Admin Portal</h1>
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

export default AdminPortal;