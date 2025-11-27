import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import Home from './pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import PatientPortal from './pages/PatientPortal';
import HospitalPortal from './pages/HospitalPortal';
import AdminPortal from './pages/AdminPortal';

function App() {
  const { user } = useAuth();

  return (
    <div className="App">
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={!user ? <Login /> : <Navigate to={`/${user.role}`} />} />
          <Route path="/register" element={!user ? <Register /> : <Navigate to={`/${user.role}`} />} />
          <Route path="/patient" element={user?.role === 'patient' ? <PatientPortal /> : <Navigate to="/login" />} />
          <Route path="/hospital" element={user?.role === 'hospital' ? <HospitalPortal /> : <Navigate to="/login" />} />
          <Route path="/admin" element={user?.role === 'admin' ? <AdminPortal /> : <Navigate to="/login" />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;