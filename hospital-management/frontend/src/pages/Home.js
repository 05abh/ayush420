import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  return (
    <div>
      <section style={{ 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '4rem 2rem',
        textAlign: 'center',
        borderRadius: '10px',
        marginBottom: '3rem'
      }}>
        <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          🏥 Ayushman Hospital Management
        </h1>
        <p style={{ fontSize: '1.2rem', marginBottom: '2rem' }}>
          Streamlining healthcare access for Ayushman card holders
        </p>
        
        {!user ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ background: 'white', color: '#667eea' }}>
              Get Started
            </Link>
            <Link to="/login" className="btn" style={{ background: 'transparent', border: '2px solid white', color: 'white' }}>
              Login
            </Link>
          </div>
        ) : (
          <Link to={`/${user.role}`} className="btn btn-primary" style={{ background: 'white', color: '#667eea' }}>
            Go to Dashboard
          </Link>
        )}
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-number">🏥</span>
          <h3>Empaneled Hospitals</h3>
          <p>Access to quality healthcare providers</p>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">🛌</span>
          <h3>Bed Availability</h3>
          <p>Real-time bed booking system</p>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">📱</span>
          <h3>Digital Management</h3>
          <p>Seamless patient care coordination</p>
        </div>
        
        <div className="stat-card">
          <span className="stat-number">⚡</span>
          <h3>Instant Notifications</h3>
          <p>Email updates for all bookings</p>
        </div>
      </div>

      <div className="card">
        <h2>How It Works</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginTop: '2rem' }}>
          <div>
            <h3>For Patients</h3>
            <ol style={{ textAlign: 'left', marginLeft: '1rem' }}>
              <li>Register with Ayushman card details</li>
              <li>Search for available hospitals</li>
              <li>Book beds in real-time</li>
              <li>Receive instant email confirmation</li>
              <li>Access digital medical records</li>
            </ol>
          </div>
          
          <div>
            <h3>For Hospitals</h3>
            <ol style={{ textAlign: 'left', marginLeft: '1rem' }}>
              <li>Register your hospital</li>
              <li>Manage bed availability</li>
              <li>Approve/reject bookings</li>
              <li>Maintain patient records</li>
              <li>Generate discharge summaries</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;