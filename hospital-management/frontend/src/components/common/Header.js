import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="header">
      <nav className="navbar">
        <div className="logo">
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            🏥 Ayushman Hospital
          </Link>
        </div>
        
        <ul className="nav-links">
          {!user ? (
            <>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/register">Register</Link></li>
            </>
          ) : (
            <>
              <li><Link to={`/${user.role}`}>Dashboard</Link></li>
              <li>
                <span>Welcome, {user.name}</span>
              </li>
              <li>
                <button 
                  onClick={handleLogout}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'white',
                    cursor: 'pointer',
                    padding: '0.5rem 1rem'
                  }}
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;